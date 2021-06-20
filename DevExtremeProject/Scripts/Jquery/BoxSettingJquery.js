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
                option.layers = layer;
                $("#TestMap").dxVectorMap(option);
                temp = null;
            },
            failure: function (errMsg) {

            }
        })
        $(this).val(null);
    });
});
var option = {
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
    var backgroundData = {
        type: "FeatureCollection",
        features: []
    };
    var boxDataSource = {
        type: "FeatureCollection",
        features: []
    };
    backgroundData.features.push(BackgroundCreate(data));
    for (var count = 0; count < data.Boxinfos.length; count++) {
        boxDataSource.features.push(BoxCreate(data.Boxinfos[count], data.Height));
    }
    var layers = [{
        color: "#FFFF00",
        hoverEnabled: false,
        dataSource: backgroundData,
        name: "background"
    }, {
        color: "#FF0000",
        borderWidth: 1,
        label: {
            enabled: true,
            dataField: "name"
        },
        dataSource: boxDataSource,
        name: "boxs"
    }];
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
function BoxCreate(boxData, maxHeight) {
    var box = {
        type: "Feature",
        properties: {
            name: boxData.Name,
            height: boxData.Height,
            width: boxData.Width,
            y: boxData.Y,
            x: boxData.X
            },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [boxData.X, maxHeight - boxData.Y],
                [boxData.X + boxData.Width, maxHeight - boxData.Y],
                [boxData.X + boxData.Width, maxHeight - (boxData.Y + boxData.Height)],
                [boxData.X, maxHeight - (boxData.Y + boxData.Height)],
            ]]
        }
    }
    return box;
}