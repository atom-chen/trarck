﻿

var MovieClip;

(function () {
    MovieClip=function (doc,timeline){
        this.doc=doc;
        this.lib=doc.library;
        this.timeline=timeline;
    };


    MovieClip.prototype.createContent=function(layers){
        for(var i in layers){
            //first is exists,not need create
            if(i!=0){
                //create layer on top
                this.timeline.addNewLayer();
            }
            //the new is on the top
            this.createLayer(0,layers[i]);
        }
    };

//one layer only on element
    MovieClip.prototype.createLayer=function(layerIndex,data){
        var timeline=this.timeline;

        var layerObj=timeline.layers[layerIndex];

        var elementName=data.element;

        layerObj.name=data.name|| yh.Path.basename(elementName);

        var frames = data.frames;
        //place element in first frame
        var firstFrame=frames[0];

        this.placeElement(layerIndex,firstFrame.startFrame,elementName);

        fl.trace("startFrame:"+firstFrame.startFrame+","+layerObj.frames[firstFrame.startFrame].elements[0]);
        this.setElementProperty(layerObj.frames[firstFrame.startFrame].elements[0],firstFrame);

        //other key frame
        for(var i=1;i<frames.length;++i){
            var frame=frames[i];
            var startFrame=frame.startFrame;
            fl.trace(layerObj.name+" is key frame["+startFrame+"] "+ (this.isKeyFrame(layerObj,startFrame)?"true":"false"));
            if(!this.isKeyFrame(layerObj,startFrame)){
                //由于一个层的元素是一样的，这里直接使用前一个关键帧的数据。
                this.timeline.convertToKeyframes(startFrame);
            }
            //set property
            this.setElementProperty(layerObj.frames[startFrame].elements[0],frame);
        }

        //create tween
        for(var i in frames){
            var frame=frames[i];
            var startFrame=frame.startFrame;

            if(frame.tweenType=="motion"){
                //create a motion
                var duration=frame.duration;
                timeline.createMotionTween(startFrame,startFrame+duration);
            }
        }
    };

    MovieClip.prototype.placeElement=function(layer,frame,elementName){
        if(!this.lib.selectItem(elementName)){
            fl.trace("can't select element "+elementName);
            return;
        }

        this.timeline.currentLayer=layer;
        this.timeline.currentFrame=frame;

        //check is key frame
        var layerObj=this.timeline.layers[layer];

        if(this.isKeyFrame(layerObj,frame)){
            //clear frame data
            this.timeline.clearKeyframes(frame);
        }else{
            //convert to key frame
            this.timeline.convertToBlankKeyframes(frame);
        }

        this.lib.addItemToDocument({x:0,y:0});
    };

    MovieClip.prototype.cloneObject=function(obj){
        var ret={};
        for(var k in obj){
            ret[k]=obj[k];
        }
        return ret;
    },

    MovieClip.prototype.setElementProperty=function(element,property){
        var doc=this.doc;

        var haveSelected=false;

        fl.trace("element:"+element);

        if(property.matrix){
            var fcaScale=0.111;
            var matrix=property.matrix;
            var width=element.width;
            var height=element.height;

//            var tx=-0.5*matrix.c*height - 0.5*matrix.a*width + matrix.tx*fcaScale;
//            var ty=-0.5*matrix.d*height - 0.5*matrix.b*width + matrix.ty*fcaScale;

            matrix=this.cloneObject(matrix);
//            matrix.tx=tx;
//            matrix.ty=ty;

            matrix.tx*=fcaScale;
            matrix.ty*=fcaScale;

            element.matrix=matrix;

            doc.selection = [element];
            doc.setTransformationPoint({x:0, y:0});
            haveSelected=true;
        }

        if(typeof(property.alpha)!="undefined"){
            if(!haveSelected){
                doc.selection=[element];
                haveSelected=true;
            }
            doc.setInstanceAlpha(property.alpha);
        }
    };

    MovieClip.prototype.isKeyFrame=function(layerObject,frameIndex){
        return layerObject.frameCount>frameIndex && layerObject.frames[frameIndex].startFrame==frameIndex;
    };
})();
