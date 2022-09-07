import { commands, ExtensionContext, extensions, languages, StatusBarAlignment, TextDocument, TextEdit, window, workspace } from 'vscode';
import Formatter from "./formatterExecutor";

var config = workspace.getConfiguration("simpl-plus-formatter");
workspace.onDidChangeConfiguration(() =>
{
    config = workspace.getConfiguration("simpl-plus-formatter");
});

export function activate (context: ExtensionContext)
{
    //? Make sure the user has Simpl+ by mwgustin installed, it is stupid to do it without it.
    var hasSimplPlusExt = extensions.all.find((extension) =>
    {
        return extension.id == "mwgustin.crestron-simpl-plus";
    });
    if (!hasSimplPlusExt)
    {
        var suggestionBox = window.showInformationMessage("The Simpl+ extension by mwgustin is basically required to code with Simpl+ in VS Code.", "Go to extension page", "I want to have a bad time");
        suggestionBox.then((val) =>
        {
            if (val == "Go to extension page")
            {
                commands.executeCommand('extension.open', 'mwgustin.crestron-simpl-plus');

                //? Also recommend their snippets plugin
                window.showInformationMessage("Their snippets extension is also pretty good.", "Sounds good", "Nah, I want to type every single letter my self.").then((val) =>
                {
                    if (val == "Sounds good")
                    {
                        commands.executeCommand('extension.open', 'mwgustin.crestron-simpl-plus-snippets');
                    }
                });
            }
        });
    }


    languages.registerDocumentFormattingEditProvider('simpl+', {
        provideDocumentFormattingEdits (document: TextDocument, options, token): TextEdit[] | undefined
        {
            return Formatter(document, options);
        }
    });

    //? Make status bar icon
    var statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, -1);
    statusBarItem.name = "Simpl+ Formatter is Active";
    statusBarItem.text = "Simpl+ Formatter";
    statusBarItem.command = { title: "Open extension settings", command: "workbench.action.openSettings", arguments: ["@ext:JoeryMunninghoff.simpl-plus-formatter"] };

    if (window.activeTextEditor && window.activeTextEditor.document.languageId == "simpl+" && config.format && config.showStatusIcon)
    {
        statusBarItem.show();
    }

    //? check for update
    window.onDidChangeActiveTextEditor((ev) =>
    {
        if (ev && ev.document.languageId == "simpl+" && config.format && config.showStatusIcon)
        {
            statusBarItem.show();
        } else
        {
            statusBarItem.hide();
        }
    });
}

export function deactivate () { }
