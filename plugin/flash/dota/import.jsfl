﻿var currentFolder=getFolder(fl.scriptURI);
var libFolder=currentFolder+"/../libs/";

fl.runScript(libFolder+"json2.jsfl");
fl.runScript(libFolder+"Path.jsfl");
fl.runScript(libFolder+"geom/MatrixTransformer.jsfl");
fl.runScript(libFolder+"geom/MatrixInterpolation.jsfl");

fl.runScript(currentFolder+"/define.jsfl");

fl.runScript(currentFolder+"/RelationMap.jsfl");
fl.runScript(currentFolder+"/ConvertFca.jsfl");
fl.runScript(currentFolder+"/MovieClip.jsfl");
fl.runScript(currentFolder+"/AnimationImport.jsfl");

//var animationImport=new AnimationImport(fl.getDocumentDOM(),1.0,"top left");
//animationImport.start("file:///E|/lua/dtcqtool/fca/temp/cha/AM/fl.json","file:///E|/lua/dtcqtool/fca/temp/heroes/AM");

//animationImport.start("file:///E|/tt/aa/fl.json","file:///E|/tt/aa");

var animationImport=new AnimationImport(fl.getDocumentDOM(),0.111,"center");
animationImport.start("file:///D|/temp/AM/cha.json","file:///D|/temp/AM/Image","file:///D|/temp/AM/Sound");

function getFolder(file){
    var dotPos=file.lastIndexOf("/");
    return file.substr(0,dotPos);
}