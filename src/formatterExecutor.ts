import { FormattingOptions, TextDocument, TextEdit } from "vscode";

export default function (document: TextDocument, options: FormattingOptions): TextEdit[] | undefined
{
    var completions: TextEdit[] = [];

    completions.push(...require('./formatters/indentation').format(document, options));
    completions.push(...require('./formatters/ifOperatorSpacing').format(document, options));
    completions.push(...require('./formatters/argumentCommas').format(document, options));
    completions.push(...require('./formatters/semicolons').format(document, options));

    return completions
}