import { FormattingOptions, TextDocument, TextEdit } from "vscode";

export default function (document: TextDocument, options: FormattingOptions): TextEdit[] | undefined
{
    var completions: TextEdit[] = [];

    // console.time("Format");
    // console.time("Indentation");
    completions.push(...require('./formatters/indentation').format(document, options));
    // console.timeEnd("Indentation");
    // console.time("Argument commas");
    completions.push(...require('./formatters/argumentCommas').format(document, options));
    // console.timeEnd("Argument commas");
    // console.time("Semicolons");
    completions.push(...require('./formatters/semicolons').format(document, options));
    // console.timeEnd("Semicolons");
    // console.time("Braces");
    completions.push(...require('./formatters/bracesPlacer').format(document, options));
    // console.timeEnd("Braces");
    // console.time("Input Output Aligner");
    completions.push(...require('./formatters/inputOutputAligner').format(document, options));
    // console.timeEnd("Input Output Aligner");
    // console.timeEnd("Format");
    return completions;
}