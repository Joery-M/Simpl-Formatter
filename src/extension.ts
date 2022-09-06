import { commands, ExtensionContext, extensions, languages, TextDocument, TextEdit, window } from 'vscode';
import Formatter from "./formatterExecutor"

export function activate (context: ExtensionContext)
{
    //? Make sure the user has Simpl+ by mwgustin installed, it is stupid to do it without it.
    var hasSimplPlusExt = extensions.all.find((extension)=>{
        return extension.id == "mwgustin.crestron-simpl-plus"
    });
    if (!hasSimplPlusExt) {
        var suggestionBox = window.showInformationMessage("The Simpl+ extension by mwgustin is basically required to code with Simpl+ in VS Code.", "Go to extension page", "I want to have a bad time")
        suggestionBox.then((val)=>{
            if (val == "Go to extension page") {
                commands.executeCommand('extension.open', 'mwgustin.crestron-simpl-plus')
                
                //? Also recommend their snippets plugin
                window.showInformationMessage("Their snippets extension is also pretty good.", "Sounds good", "Nah, I want to type every single letter my self.").then((val)=>{
                    if (val == "Sounds good") {
                        commands.executeCommand('extension.open', 'mwgustin.crestron-simpl-plus-snippets')
                    }
                })
            }
        })
    }


    languages.registerDocumentFormattingEditProvider('simpl+', {
        provideDocumentFormattingEdits (document: TextDocument, options, token): TextEdit[] | undefined
        {
            return Formatter(document, options)
        }
    });
}

export function deactivate () { }
