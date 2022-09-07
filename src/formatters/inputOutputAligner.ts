import { workspace, Range, TextDocument, TextEdit, FormattingOptions } from 'vscode';

var config = workspace.getConfiguration("simpl-plus-formatter");
workspace.onDidChangeConfiguration(() =>
{
    config = workspace.getConfiguration("simpl-plus-formatter");
});


export function format (document: TextDocument, options: FormattingOptions): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];

    if (!config.alignInputsAndOutputs)
    {
        return modifications;
    }


    var text = document.getText();
    var inOutReg = /(?<input>^(STRING|DIGITAL|ANALOG|BUFFER)_(INPUT|OUTPUT) )(?<variables>.*[,;])/gm;

    let match;
    while (match = inOutReg.exec(text))
    {
        if (match && match.groups)
        {
            var regexRange = new Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
            var newText = match[0];
            var type = match.groups["input"];
            var variables = match.groups["variables"].split(", ");

            var indent = "";
            for (let i = 0; i < type.length; i++)
            {
                if (i + options.tabSize < type.length && !options.insertSpaces)
                {
                    indent += "\t";
                    i += options.tabSize - 1;
                } else
                {
                    indent += " ";
                }
            }

            newText = newText.replace(variables.join(", "), variables.join(",\n" + indent));
            modifications.push(TextEdit.replace(regexRange, newText));
        }
    }

    return modifications;
}