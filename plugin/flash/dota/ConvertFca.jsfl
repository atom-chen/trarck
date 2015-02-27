﻿var ConvertFca;
(function (){

ConvertFca=function(fca){
    this.fca=fca;
};

ConvertFca.prototype={
    convertActions:function (){
        var ret=[];
        var actions=this.fca.actions;
        for(var i in actions){
            var action=actions[i];
            ret.push(this.convertAction(action,this.fca.elements));
        }
        return ret;
    },

    convertAction:function (action,characters){

        return {
            name:action.name,
            frameCount:action.frames.length,
            layers:this.convertActionElements(action,characters),
            eventLayers:this.convertActionEvents(action)
        };
    },

    convertActionElements:function (action,characters){
        var frames=action.frames;
        var baseLayers=this.makeBaseLayers(action);
        var layers=[];

        //处理element
        for(var i=0;i<baseLayers.length;++i){
            var elementIndex=baseLayers[i];
            var character=characters[elementIndex-1];
            var layer={
                element:character.name,
                frames:[]
            };

            var layerFrame;

            for(var k=0;k<frames.length;++k){
                var frame=frames[k];
                var ele=this.getElement(frame.elements,baseLayers[i]);
                if(ele){
                    //check the property.now is alpha and matrix;
                    if(layerFrame && this.isFramePropertySame(layerFrame,ele)){
                        ++layerFrame.continueCount;
                    }else{
                        layerFrame={
                            startFrame:k,
                            continueCount:1,
                            alpha:ele.alpha,
                            matrix:ele.matrix
                        };
                        layer.frames.push(layerFrame);
                    }
                }else{
                    //the frame is not visible
                    if(layerFrame){
                        layerFrame=null;
                    }
                }
            }
            layers.push(layer);
        }

        return layers;
    },

    convertActionEvents:function(action){
        //处理event.按类型分层。同一帧不能有重复的类型。
        var eventLayers=[];

        var eventType;
        var eventLayer;
        var layerFrame;

        var frames=action.frames;
        for(var k=0;k<frames.length;++k){
            var frame=frames[k];
            if(frame.events && frame.events.length){
                for(var j=0;j<frame.events.length;++j){
                    eventType=frame.events[j].type;

                    eventLayer=eventLayers[eventType];
                    //没有则创建
                    if(!eventLayer){
                        eventLayer={
                            name:EventLayerPrefix+EventTypeNames[eventType],
                            frames:[]
                        };

                        eventLayers[eventType]=eventLayer;
                    }

                    switch (eventType){
                        case EventType.Sound:
                            layerFrame={
                                startFrame:k,
                                type:eventType,
                                soundName:frame.events[j].arg
                            };
                            eventLayer.frames.push(layerFrame);
                            break;
                        case EventType.AddEffect:
                            break;
                        case EventType.RemoveEffect:
                            break;
                    }
                }
            }
        }

        return eventLayers;
    },

    isFramePropertySame:function (aFrame,bFrame){
        return aFrame.alpha==bFrame.alpha
            && aFrame.matrix.a==bFrame.matrix.a
            && aFrame.matrix.b==bFrame.matrix.b
            && aFrame.matrix.c==bFrame.matrix.c
            && aFrame.matrix.d==bFrame.matrix.d
            && aFrame.matrix.tx==bFrame.matrix.tx
            && aFrame.matrix.ty==bFrame.matrix.ty;
    },

    getElement:function (elements,index){
        for(var i in elements){
            if(elements[i].index==index){
                return elements[i];
            }
        }

        return null;
    },

    makeBaseLayers:function (action){
        var frames=action.frames;

        var layers=[];

        var before=-1,after=-1;

        for(var k=0;k<frames.length;++k){
            var frame=frames[k];

            for(var i=0;i<frame.elements.length;++i){
                var ele=frame.elements[i];

                //由于layer的顺序是一定的，一旦在某个frame中确定，在其它frame中不会改变。
                //首先确定是否在layer中。
                if(layers.indexOf(ele.index)!=-1){
                    //存在，则不比较
                    continue;
                }

                before=-1;
                after=-1;

                if(i>0){
                    before=frame.elements[i-1].index;
                }

                if(i<frame.elements.length-1){
                    after=frame.elements[i+1].index;
                }

                var pos=this.getPositionOfLayer(before,after,layers);

//			console.log(pos,ele.index);

                if(pos!=-1){
                    //检查是否存在
                    if(layers[pos]!=ele.index){
                        layers.splice(pos,0,ele.index);
                    }
                }else{
                    //console.log("can't find position put to first",action.name,k,i,ele.index);
                    layers.unshift(ele.index);
                }
            }
        }

        return layers;
    },
    getPositionOfLayer:function (before,after,layers){
        if(layers.length==0) return 0;

        var pos=-1;

        if(before!=-1){
            for(var i=0;i<layers.length;++i){
                if(before==layers[i]){
                    pos=i+1;
                    break;
                }
            }
        }

        if(after!=-1){
            for(var i=(pos==-1?0:pos);i<layers.length;++i){
                if(after==layers[i]){
                    pos=i;
                    break;
                }
            }
        }
        return pos;
    }
};
})();