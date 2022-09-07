import { FormattingOptions, Range, TextDocument, TextEdit } from 'vscode';

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

    let IOMatch;
    var IOvars: [number, Range][] = [];
    var IOregex = /(?<ioType>^(STRING|DIGITAL|ANALOG|BUFFER)_(INPUT|OUTPUT) )((.|\n|\r)*?);/gm;
    while ((IOMatch = IOregex.exec(text)))
    {
        if (IOMatch.groups) {
            var size = IOMatch.groups["ioType"].length
            IOvars.push([size, new Range(document.positionAt(IOMatch.index), document.positionAt(IOMatch.index + IOMatch[0].length))]);
        }
    }

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

        //? Make sure the IO block gets formatted correctly
        IOvars.forEach((comment)=>{
            if(comment[1].contains(line.range.start) && !/^(STRING|DIGITAL|ANALOG|BUFFER)/.test(line.text)){
                curTabChars = ""
                for (let i = 0; i < comment[0]; i++) {
                    if (i + options.tabSize < comment[0] && !options.insertSpaces) {
                        curTabChars += "\t"
                        i += options.tabSize - 1
                    }else{
                        curTabChars += " "
                    }
                }
            }
        })

        newText = curTabChars + newText;
        if (newText !== line.text) {
            modifications.push(TextEdit.replace(line.range, newText));
        }
    });
    return modifications;
}