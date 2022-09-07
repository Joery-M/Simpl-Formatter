import { workspace, Range, TextDocument, TextEdit } from 'vscode';

var config = workspace.getConfiguration("simpl-plus-formatter");
workspace.onDidChangeConfiguration(() =>
{
    config = workspace.getConfiguration("simpl-plus-formatter");
});

export function format (document: TextDocument): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];
    var text = document.getText();
    var braceDetector = /(?<!\/\/.*)(?<operator>function|while|if|for|else|[A-z ]*(change|push|release))( )?.*/gim;

    let match;
    while ((match = braceDetector.exec(text)))
    {
        if (match && match.groups)
        {
            var regexRange = new Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
            var newText = match[0];

            if (config.placeOpenBraceOnNewLine)
            {
                var fullLine = document.lineAt(regexRange.start.line);
                var indent = /(^[\t ]*)/.exec(fullLine.text)?.at(0) || "";
                newText = newText.replace(/\{[ \t]*$/, "\n" + indent + "{");
                newText = newText.replace(/[\t ]*$/gm, "")
            } else
            {
                var nextLine = document.lineAt(document.positionAt(match.index).line + 1);
                if ((/(?<=^[\t ]*)\{$/gm).test(nextLine.text)) {
                    regexRange = new Range(document.positionAt(match.index), nextLine.range.end)
                    newText = document.getText(regexRange)
                    newText = newText.replace(/[\n\r]*[\t ]*\{/gm, " {")
                }
                newText = newText.replace(/[ \t]*\{[ \t]*$/, " {")
            }

            if (match[0] !== newText) {
                modifications.push(TextEdit.replace(regexRange, newText));
            }
        }
    }


    return modifications;
}