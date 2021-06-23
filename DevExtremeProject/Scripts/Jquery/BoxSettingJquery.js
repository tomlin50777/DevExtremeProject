$(function () {
    $("#ImageInputButton").dxButton({
        stylingMode: "contained",
        text: "Upload",
        type: "normal",
        width: 120,
        onClick: function () {
            $('#Input').click();
        }
    });
});
$(document).ready(function () {
    $('#Input').change(function () {
        var formData = new FormData();
        formData.append('file',$('#Input')[0].files[0]);
        $.ajax({
            type: "Post",
            url: "../Home/BoxImage",
            data: formData,
            contentType: "application/json; charset=utf-8",
            contentType: false,
            processData: false,
            dataType: "json",
            async: false,
            success: function (data) {
                data = data.replaceAll('\n', '');
                var temp = JSON.parse(data)
                var layer = DataPacket(temp);
                $("#TestMap").dxVectorMap({
                    maxZoomFactor: 4,
                    layers: layer,
                    tooltip: {
                        enabled: true,
                        customizeTooltip: function (arg) {
                            if (arg.layer.name != "background") {
                                var show = "";
                                show += "X:" + arg.attribute("x") + "_____";
                                show += "y:" + arg.attribute("y") + "_____";
                                show += "Width:" + arg.attribute("width") + "_____";
                                show += "Height:" + arg.attribute("height");
                                return { text: show };
                            }
                        }
                    },
                    onClick: function(e){
                        e = null;
                    }
                });
                $("#Test").dxVectorMap('instance').option('layers').push(layer[1]);
                temp = null;
            },
            failure: function (errMsg) {

            }
        })
        $(this).val(null);
    });
});
function DataPacket(data) {
    var lineColorClass = {};
    var bodyColorClass = {};
    var colors;
    var layers = [];
    var backgroundData = {
        type: "FeatureCollection",
        features: []
    };
    backgroundData.features.push(BackgroundCreate(data));
    //layers.push({
    //    color: data.BackgroundColor,
    //    hoverEnabled: false,
    //    dataSource: backgroundData,
    //    name: "background"
    //});

    for (var count = 0; count < data.Boxinfos.length; count++) {
        if (!lineColorClass.hasOwnProperty(data.Boxinfos[count].LineColor))
            lineColorClass[data.Boxinfos[count].LineColor] = []
        lineColorClass[data.Boxinfos[count].LineColor].push(data.Boxinfos[count]);
        if (!bodyColorClass.hasOwnProperty(data.Boxinfos[count].BodyColor))
            bodyColorClass[data.Boxinfos[count].BodyColor] = []
        bodyColorClass[data.Boxinfos[count].BodyColor].push(data.Boxinfos[count]);
    }
    colors = Object.keys(lineColorClass);
    for (var countY = 0; countY < colors.length; countY++) {
        var boxDataSource = {
            type: "FeatureCollection",
            features: []
        };
        for (var count = 0; count < lineColorClass[colors[countY]].length; count++) {
            boxDataSource.features.push(BoxCreate(lineColorClass[colors[countY]][count], data.Height, false));
        }
        layers.push({
            color: colors[countY],
            hoverEnabled: false,
            dataSource: boxDataSource,
            name: "boxsBorder" + countY
        });
    }
    colors = Object.keys(bodyColorClass);
    for (var countY = 0; countY < colors.length; countY++) {
        var boxDataSource = {
            type: "FeatureCollection",
            features: []
        };
        for (var count = 0; count < bodyColorClass[colors[countY]].length; count++) {
            boxDataSource.features.push(BoxCreate(bodyColorClass[colors[countY]][count], data.Height, true));
        }
        layers.push({
            color: colors[countY],
            borderWidth: 1,
            label: {
                enabled: true,
                dataField: "name"
            },
            dataSource: boxDataSource,
            name: "boxsBody" + countY
        });
    }
    return layers;
}
function BackgroundCreate(backgroundData) {
    var background = {
        type: "Feature",
        properties: {
            height: backgroundData.Height,
            width: backgroundData.Width,
            y: backgroundData.Y,
            x: backgroundData.X
        },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [backgroundData.X, backgroundData.Y],
                [backgroundData.X + backgroundData.Width, backgroundData.Y],
                [backgroundData.X + backgroundData.Width, backgroundData.Y + backgroundData.Height],
                [backgroundData.X, backgroundData.Y + backgroundData.Height],
            ]]
        }
    }
    return background;
}
function BoxCreate(boxData, maxHeight, isBody) {
    var x = boxData.X;
    var y = boxData.Y
    var width = boxData.Width;
    var height = boxData.Height;
    if (isBody) {
        x += boxData.LineWidth;
        y += boxData.LineWidth;
        width -= 2 * boxData.LineWidth;
        height -= 2 * boxData.LineWidth;
    }
    var box = {
        type: "Feature",
        properties: {
            name: boxData.Name,
            height: height,
            width: width,
            y: y,
            x: x
            },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [x, maxHeight - y],
                [x + width, maxHeight - y],
                [x + width, maxHeight - (y + height)],
                [x, maxHeight - (y + height)],
            ]]
        }
    }
    return box;
}


//var buildingData = {
//    type: "FeatureCollection",
//    features: [
//        {
//            type: "Feature",
//            properties: {
//                name: "QQ",
//                square: 666
//            },
//            geometry: {
//                type: "Polygon",
//                coordinates: [[
//                    [10, -80],
//                    [-80, -80],
//                    [-80, 80],
//                    [40, 80],
//                    [40, -20],
//                    [100, -20],
//                    [100, -80],
//                    [30, -80],
//                    [30, -74],
//                    [34, -74],
//                    [34, -68],
//                    [40, -68],
//                    [40, -74],
//                    [94, -74],
//                    [94, -26],
//                    [40, -26],
//                    [40, -60],
//                    [34, -60],
//                    [34, 74],
//                    [-74, 74],
//                    [-74, 30],
//                    [10, 30],
//                    [10, 24],
//                    [-74, 24],
//                    [-74, -24],
//                    [10, -24],
//                    [10, -30],
//                    [-74, -30],
//                    [-74, -74],
//                    [10, -74]
//                ]]
//            }
//        }
//    ]
//};
//var roomsData = {
//    type: "FeatureCollection",
//    features: [
//        {
//            type: "Feature",
//            properties: {
//                name: "Room 1",
//                square: 576
//            },
//            geometry: {
//                type: "Polygon",
//                coordinates: [[
//                    [-74, -30],
//                    [34, -30],
//                    [34, -74],
//                    [-74, -74]
//                ]]
//            }
//        }, {
//            type: "Feature",
//            properties: {
//                name: "Room 2",
//                square: 600
//            },
//            geometry: {
//                type: "Polygon",
//                coordinates: [[
//                    [-74, 24],
//                    [34, 24],
//                    [34, -24],
//                    [-74, -24]
//                ]]
//            }
//        }, {
//            type: "Feature",
//            properties: {
//                name: "Room 3",
//                square: 540
//            },
//            geometry: {
//                type: "Polygon",
//                coordinates: [[
//                    [-74, 74],
//                    [34, 74],
//                    [34, 30],
//                    [-74, 30]
//                ]]
//            }
//        }, {
//            type: "Feature",
//            properties: {
//                name: "Room 4",
//                square: 288
//            },
//            geometry: {
//                type: "Polygon",
//                coordinates: [[
//                    [40, -26],
//                    [94, -26],
//                    [94, -74],
//                    [40, -74]
//                ]]
//            }
//        }
//    ]
//};

//$(function () {
//    $("#Test").dxVectorMap({
//        maxZoomFactor: 4,
//        //projection: {
//        //    to: function (coordinates) {
//        //        return [coordinates[0] / 100, coordinates[1] / 100];
//        //    },

//        //    from: function (coordinates) {
//        //        return [coordinates[0] * 100, coordinates[1] * 100];
//        //    }
//        //},
//        layers: [{
//            hoverEnabled: false,
//            dataSource: buildingData,
//            name: "building"
//        }],
//        tooltip: {
//            enabled: true,
//            customizeTooltip: function (arg) {
//                return { text: "Square: " + arg.attribute("square") + " ft&#178" };
//            }
//        }
//    });
//});
