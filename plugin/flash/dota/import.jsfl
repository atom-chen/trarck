var currentFolder=getFolder(fl.scriptURI);
var libFolder=currentFolder+"/../libs/";

fl.runScript(libFolder+"json2.jsfl");
fl.runScript(libFolder+"Path.jsfl");

fl.runScript(currentFolder+"/MovieClip.jsfl");
fl.runScript(currentFolder+"/AnimationImport.jsfl");

var animationImport=new AnimationImport(fl.getDocumentDOM());
animationImport.start("file:///E|/lua/dtcqtool/fca/temp/cha/AM/fl.json","file:///E|/lua/dtcqtool/fca/temp/heroes/AM");




function getFolder(file){
    var dotPos=file.lastIndexOf("/");
    return file.substr(0,dotPos);
}