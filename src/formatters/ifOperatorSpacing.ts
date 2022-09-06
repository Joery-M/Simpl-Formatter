import { FormattingOptions, TextDocument, TextEdit } from 'vscode';

export function format(document: TextDocument): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];
    var text = document.getText();

    text.split("\n").forEach((_line, lineIndex) =>
    {
        var line = document.lineAt(lineIndex);
        var newText = line.text;

        var regexNoSpaceStart = /(?<=^[\t ]*(if|while|for|).*?)(?<![ <>&|])([!<>=&|][&|<>]?)/ig
        var regexNoSpaceEnd = /(?<=^[\t ]*(if|while|for|).*?)([!<>=&|][<>=&|]?)(?![<>= &|])/ig
        var regexNoSpace = /(?<=^[\t ]*(if|while|for|).*?)(?<![ <])([!<>&|][<>=&|]?)(?! )/ig

        newText = newText.replace(regexNoSpaceStart, " $2")
        newText = newText.replace(regexNoSpaceEnd, "$2 ")
        newText = newText.replace(regexNoSpace, " $2 ")
        

        if (line.text !== newText) {
            modifications.push(TextEdit.replace(line.range, newText));
        }
    });
    return modifications;
}