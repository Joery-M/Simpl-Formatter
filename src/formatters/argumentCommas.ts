import { FormattingOptions, TextDocument, TextEdit } from 'vscode';

export function format(document: TextDocument): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];
    var text = document.getText();

    text.split("\n").forEach((_line, lineIndex) =>
    {
        var line = document.lineAt(lineIndex);
        var newText = line.text;

        var argumentRegex = /(?<=[A-z0-9]\(.*?),(?! )(?=.*?\))/gi

        newText = newText.replace(argumentRegex, ", ")
        

        if (line.text !== newText) {
            modifications.push(TextEdit.replace(line.range, newText));
        }
    });
    return modifications;
}