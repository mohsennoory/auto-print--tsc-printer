"use strict";

//var edge = require('edge-js');
import * as edge from "edge-js";
//var express = require('express');
import express from "express";
//var bodyParser = require('body-parser');
import bodyParser from "body-parser";
//const util = require('util');
import * as util from "util";
//const { exec } = require('child_process');
import { exec } from "child_process";
//var fs = require('fs');
import * as fs from "fs";
//const formidable = require('formidable')
//import * as formidable from 'formidable';
import { IncomingForm } from "formidable";
import cors from "cors";

var app = express();

var about;
var openport;
var sendcommand;
var clearbuffer;
var printerfont;
var barcode;
var printlabel;
var closeport;
var printer_status;
var sendcommand_utf8;
var sendcommand_binary;
var windowsfont;
var setup;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(express.static("./"));

app.listen(8888, function () {
  console.log("App is Ready to print!!");
});

app.get("/test_get", function (req, res) {
  console.log("GET Function Test!!");
});

app.post("/", urlencodedParser, async function (req, res) {
  await printfile(req, res);
});

try {
  openport = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "openport",
  });
} catch (error) {
  console.log(error);
}

try {
  about = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "about",
  });
} catch (error) {
  console.log(error);
}

try {
  sendcommand = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "sendcommand",
  });
} catch (error) {
  console.log(error);
}

try {
  clearbuffer = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "clearbuffer",
  });
} catch (error) {
  console.log(error);
}

try {
  printerfont = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "printerfont",
  });
} catch (error) {
  console.log(error);
}

try {
  barcode = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "barcode",
  });
} catch (error) {
  console.log(error);
}

try {
  printlabel = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "printlabel",
  });
} catch (error) {
  console.log(error);
}

try {
  closeport = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "closeport",
  });
} catch (error) {
  console.log(error);
}

try {
  printer_status = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "printerstatus_string",
  });
} catch (error) {
  console.log(error);
}

try {
  sendcommand_utf8 = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "sendcommand_utf8",
  });
} catch (error) {
  console.log(error);
}

try {
  sendcommand_binary = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "sendcommand_binary",
  });
} catch (error) {
  console.log(error);
}

try {
  windowsfont = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "windowsfont",
  });
} catch (error) {
  console.log(error);
}

try {
  setup = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "setup",
  });
} catch (error) {
  console.log(error);
}

async function printfile(req, res) {
  // var font_variable = { x: '50', y: '50', fonttype: '3', rotation: '0', xmul: '1', ymul: '1', text: 'MOHSEN NOOORI' }
  // var windowsfont_variable = { x: 50, y: 250, fontheight: 64, rotation: 0, fontstyle: 0, fontunderline: 0, szFaceName: 'Arial', content: 'Windowsfont Test' }
  // var barcode_variable = { x: '50', y: '100', type: '128', height: '70', readable: '0', rotation: '0', narrow: '3', wide: '1', code: '123456' }
  // var label_variable = { quantity: '1', copy: '1' };

  openport("");

  var status = printer_status(100, true);

  clearbuffer("", true);
  //printerfont(font_variable, true);
  //barcode(barcode_variable, true);
  //windowsfont(windowsfont_variable, true);
  sendcommand("CODEPAGE UTF-8", true);
  //sendcommand('CLEARBUFFER', true);
  setup(
    {
      width: "21",
      height: "500",
      speed: "4",
      density: "15",
      sensor: "0",
      vertical: "3mm",
      offset: "0",
    },
    true
  );
  //sendcommand('TEXT 250,50,\"0\",0,10,10,\"Text Test!!\"', true);
  //sendcommand_utf8('TEXT 50,200,\"KAIU.TTF\",0,10,10,\"測試中文Text Test!!\"', true);
  //printlabel(label_variable, true);

  var selftest_command = "SELFTEST\r\n";
  var arr = [];
  for (var i = 0; i < selftest_command.length; ++i) {
    arr.push(selftest_command.charCodeAt(i));
  }

  //var selftest_command_buffer = new Uint8Array(arr);

  //sendcommand_binary(selftest_command_buffer, true);

  if (status != "00") {
    console.log("printer is not ready");
    res.status(500).send("printer is not ready");
    res.redirect(req.get("referer"));
  }

  if (status == "00") {
    console.log("printer is ready");

    const imageToprint = "download.png";
    let imageToprintPath; //= __dirname + "\\" + "download.png";
    let printerName;
    let allowedPrinters = ["TSC TE200"];
    let printers = [];
    let printer;
    let printerOriginalName;
    let driverName;
    let deviceId;

    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      console.log(files);
      imageToprintPath = files.fileupload[0].filepath;
      fs.rename(imageToprintPath, imageToprintPath + ".png", (err) => {
        if (err) {
          //console.log(err);
          res.send("print failed");
        }
      });
      exec("wmic printer list full", (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          console.log(err);
          return;
        }

        // list of printers with brief details
        //console.log(stdout);
        // the *entire* stdout and stderr (buffered)
        stdout = stdout.split(/Attributes=\d+/);

        stdout.forEach((element) => {
          printer = element.split("\r\r\n");

          driverName = printer.find((attrib) => {
            return allowedPrinters.includes(attrib.slice(11));
          });

          if (driverName) {
            printerOriginalName = driverName.split("=")[1];

            deviceId = printer.find((attrib) => {
              return attrib.slice(0, 8) == "DeviceID";
            });
          }

          if (deviceId) {
            printerName = deviceId.slice(9);
          }
        });

        if (printerName) {
          exec(
            "del %systemroot%\\System32\\spool\\printers* /Q",
            function (error, data) {
              //console.log(data)
              if (error) {
                //console.log(error);
                return;
              }

              exec(
                `rundll32 shimgvw.dll,ImageView_PrintTo "${imageToprintPath}.png" "${printerName}"`,
                function (error, data) {
                  //console.log(data.toString());
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  try {
                    fs.unlinkSync(imageToprintPath + ".png");
                    //ddddddd
                    res.status(200).send("print was successfull");
                    //res.redirect(req.get("referer"));
                  } catch (error) {}
                }
              );
            }
          );
        } else {
          try {
            fs.unlinkSync(imageToprintPath + ".png");
          } catch (error) {}
          console.log(
            "Unauthorized printer, just TSC printers are allowed to print"
          );
          res.status(403).send("Unauthorized printer");
          //res.redirect(req.get("referer"));
        }
      });
    });
  }

  closeport("", true);
}
