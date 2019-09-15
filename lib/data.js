// dependencies
var fs = require('fs');
var path = require('path');

// the container
var lib = {};
lib.baseDir = path.join(__dirname,'/../.data/');
lib.create = function(dir,file,data,callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(err){
                    callback('Can not write data to this file');
                }else{
                   fs.close(fileDescriptor,function(err){
                        if(err){
                            callback('Unable to close file');
                        }else{
                            callback(false);
                        }
                    })
                }
            })
        }else{
            callback('Can not create file. It may already exist');
        }
    })    
}
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    })
}
lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.truncate(fileDescriptor,function(err){
                if(!err){
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Can not close file');
                                }
                            })
                        }else{
                                    callback('Can not write to this file');
                        }
                    })
                }else{
                    callback('Can not truncate this file');
                }
            })
        }else{
            callback(err);
        }
    })
}
lib.delete = function(dir, file, callback){
    fs.unlink(lib.baseDir+dir+"/"+file+'.json',function(err){
        callback(err);
    })
}
// exporting container
module.exports = lib;