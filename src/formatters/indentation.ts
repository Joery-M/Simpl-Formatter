import { FormattingOptions, TextDocument, TextEdit } from 'vscode';

export function format(document: TextDocument, options: FormattingOptions): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];
    var text = document.getText();
    var tabChar = "\t";
    if (options.insertSpaces)
    {
        tabChar = "";
        for (let i = 0; i < options.tabSize; i++)
        {
            tabChar += " ";
        }
    }
    var tabSize = 0;

    text.split("\n").forEach((_line, lineIndex) =>
    {
        var line = document.lineAt(lineIndex);
        var newText = "";
        newText = line.text.replace(/^[\t ]*(?=.)/g, "");
        var curTabChars = "";

        //? First see if it has to decrease
        if (line.text.includes("}"))
        {
            tabSize--;
        }
        //? Then add the chars
        for (let i = 0; i < tabSize; i++)
        {
            curTabChars += tabChar;
        }

        //? Then see if it has to increase for the next line
        if (line.text.includes("{"))
        {
            tabSize++;
        }
        newText = curTabChars + newText;
        if (newText !== line.text) {
            modifications.push(TextEdit.replace(line.range, newText));
        }
    });
    return modifications;
}