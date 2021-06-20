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
                vectorMapoption.layers = layer;
                $("#TestMap").dxVectorMap(vectorMapoption);
                temp = null;
            },
            failure: function (errMsg) {

            }
        })
        $(this).val(null);
    });
});
var vectorMapoption = {
    maxZoomFactor: 4,
    size: {
        width: 1200,
        height: 800
    },
    tooltip: {
        enabled: true,
        customizeTooltip: function (arg) {
            var show = "";
            show += "X:" + arg.attribute("x") + "_____";
            show += "y:" + arg.attribute("y") + "_____";
            show += "Width:" + arg.attribute("width") + "_____";
            show += "Height:" + arg.attribute("height");
            return { text: show };
        }
    }
};
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
    layers.push({
        color: data.BackgroundColor,
        hoverEnabled: false,
        dataSource: backgroundData,
        name: "background"
    });

    for (var count = 0; count < data.Boxinfos.length; count++) {
        if (!lineColorClass.hasOwnProperty(data.Boxinfos[count].LineColor))
            lineColorClass[data.Boxinfos[count].LineColor] = []
        lineColorClass[data.Boxinfos[count].LineColor].push(data.Boxinfos[count]);
        if (!bodyColorClass.hasOwnProperty(data.Boxinfos[count].BodyColor))
            bodyColorClass[data.Boxinfos[count].BodyColor] = []
        bodyColorClass[data.Boxinfos[count].BodyColor].push(data.Boxinfos[count]);
    }
    //colors = Object.keys(lineColorClass);
    //for (var countY = 0; countY < colors.length; countY++) {
    //    var boxDataSource = {
    //        type: "FeatureCollection",
    //        features: []
    //    };
    //    for (var count = 0; count < lineColorClass[colors[countY]].length; count++) {
    //        boxDataSource.features.push(BoxCreate(lineColorClass[colors[countY]][count], data.Height, false));
    //    }
    //    layers.push({
    //        color: colors[countY],
    //        hoverEnabled: false,
    //        dataSource: boxDataSource,
    //        name: "boxsBorder" + countY
    //    });
    //}
    //colors = Object.keys(bodyColorClass);
    //for (var countY = 0; countY < colors.length; countY++) {
    //    var boxDataSource = {
    //        type: "FeatureCollection",
    //        features: []
    //    };
    //    for (var count = 0; count < bodyColorClass[colors[countY]].length; count++) {
    //        boxDataSource.features.push(BoxCreate(bodyColorClass[colors[countY]][count], data.Height, true));
    //    }
    //    layers.push({
    //        color: colors[countY],
    //        borderWidth: 1,
    //        label: {
    //            enabled: true,
    //            dataField: "name"
    //        },
    //        dataSource: boxDataSource,
    //        name: "boxsBody" + countY
    //    });
    //}
    //var layers = [{
    //    color: "#FFFF00",
    //    hoverEnabled: false,
    //    dataSource: backgroundData,
    //    name: "background"
    //}, {
    //    color: "#FF0000",
    //    borderWidth: 1,
    //    label: {
    //        enabled: true,
    //        dataField: "name"
    //    },
    //    dataSource: boxDataSource,
    //    name: "boxs"
    //}];
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