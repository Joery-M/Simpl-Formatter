import { comments, FormattingOptions, Range, tests, TextDocument, TextEdit } from 'vscode';

export function format (document: TextDocument, options: FormattingOptions): TextEdit[] | undefined
{
    var modifications: TextEdit[] = [];
    var text = document.getText();
    var semiColonRegex = /^(if|while|else|#|for|}|{|[A-z_]*?function|[A-z ]*(push|release|change)|\/\*|\*\/|\/\/)/i;
    var indentRemoveRegex = /(^[\t ]*)/gi;

    let blockMatch;
    var blockComments: Range[] = [];
    var blockCommentRegex = /\/\*(\*(?!\/)|[^*])*\*\//g;
    while ((blockMatch = blockCommentRegex.exec(text)))
    {
        blockComments.push(new Range(document.positionAt(blockMatch.index), document.positionAt(blockMatch.index + blockMatch[0].length)));
    }
    let IOMatch;
    var IOvars: Range[] = [];
    var IOregex = /(^(STRING|DIGITAL|ANALOG|BUFFER)_(INPUT|OUTPUT) )((.|\n|\r)*?)(?=;)/gm;
    while ((IOMatch = IOregex.exec(text)))
    {
        IOvars.push(new Range(document.positionAt(IOMatch.index), document.positionAt(IOMatch.index + IOMatch[0].length)));
    }


    text.split("\n").forEach((_line, lineIndex) =>
    {
        var line = document.lineAt(lineIndex);
        var newText = line.text;
        var textWithoutIndent = newText.replace(indentRemoveRegex, "");
        var inBlockComment = false;
        var inIO = false;

        blockComments.forEach((comment)=>{
            if(comment.contains(line.range)){
                inBlockComment = true
            }
        })
        IOvars.forEach((comment)=>{
            if(comment.contains(line.range) && line.text.endsWith(",")){
                inIO = true
            }
        })

        if (!semiColonRegex.test(textWithoutIndent) && !(/\;[ \t]*$/.test(newText)) && !line.isEmptyOrWhitespace && !inBlockComment && !inIO)
        {
            newText = newText + ";";
            modifications.push(TextEdit.replace(line.range, newText));
        }
    });
    return modifications;
}