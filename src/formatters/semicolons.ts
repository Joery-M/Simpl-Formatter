import { FormattingOptions, TextDocument, TextEdit } from 'vscode';

export function format(document: TextDocument, options: FormattingOptions): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];
    var text = document.getText();
    var semiColonRegex = /^(if|while|else|#|for|}|{|[A-z_]*?function|[A-z ]*(push|release|change)|\/\*|\*\/|\/\/)/i;
    var indentRemoveRegex = /(^[\t ]*)/gi
    var inBlockComment = false

    text.split("\n").forEach((_line, lineIndex) =>
    {
        var line = document.lineAt(lineIndex);
        var prevLine = document.lineAt(Math.max(lineIndex - 1, 0))
        var newText = line.text;
        var textWithoutIndent = newText.replace(indentRemoveRegex, "")

        //* Start of a block comment
        if (line.text.includes("\/*") && !line.text.includes("\/\/*")) {
            inBlockComment = true
        }

        //* End of a block comment
        if (prevLine.text.includes("*\/")) {
            inBlockComment = false
        }

        
        if (!semiColonRegex.test(textWithoutIndent) && !newText.endsWith(";") && !line.isEmptyOrWhitespace && !inBlockComment) {
            newText = newText + ";"
            modifications.push(TextEdit.replace(line.range, newText));
        }
    });
    return modifications;
}