import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ImageOverlayWebGL from "./ImageOverlayWebGL.react";
import Colormap from "./Colormap.react";

import { Circle, LayerGroup, Polygon, Polyline, Tooltip } from "react-leaflet";

const yx = ([x, y]) => {
    return [y, x];
};

class CompositeMapLayer extends Component {
    renderTooltip(item) {
        if ("tooltip" in item) {
            return <Tooltip sticky={true}>{item.tooltip}</Tooltip>;
        }
        return null;
    }

    renderItem(item, index) {
        if (item.type === "polyline") {
            const positions = item.positions.map(xy => yx(xy));
            return (
                <Polyline
                    onClick={() => this.props.lineCoords(positions)}
                    color={item.color}
                    positions={positions}
                    key={index}
                >
                    {this.renderTooltip(item)}
                </Polyline>
            );
        }
        if (item.type === "polygon") {
            const positions = item.positions.map(xy => yx(xy));
            return (
                <Polygon
                    onClick={() => this.props.polygonCoords(positions)}
                    color={item.color}
                    positions={positions}
                    key={index}
                >
                    {this.renderTooltip(item)}
                </Polygon>
            );
        }
        if (item.type === "circle") {
            return (
                <Circle
                    color={item.color}
                    center={yx(item.center)}
                    radius={item.radius}
                    key={index}
                >
                    {this.renderTooltip(item)}
                </Circle>
            );
        }
        if (item.type === "image") {
            return (
                <>
                    <ImageOverlayWebGL
                        url={item.url}
                        colormap={item.colormap}
                        bounds={item.bounds.map(xy => yx(xy))}
                        hillShading={
                            this.props.hillShading && item.allowHillshading
                        }
                        elevationScale={item.elevationScale || 0.03}
                        lightDirection={this.props.lightDirection}
                        minvalue={item.minvalue}
                        maxvalue={item.maxvalue}
                        unit={item.unit}
                        key={index}
                    />
                    {"colormap" in item && (
                        <Colormap
                            colormap={item.colormap}
                            unit={item.unit}
                            minvalue={item.minvalue}
                            maxvalue={item.maxvalue}
                            position="bottomleft"
                            key={"colormap" + index}
                        />
                    )}
                </>
            );
        }
        return null;
    }

    render() {
        return (
            <LayerGroup>
                {this.props.layer.data.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            {this.renderItem(item, index)}
                        </Fragment>
                    );
                })}
            </LayerGroup>
        );
    }
}

CompositeMapLayer.propTypes = {
    /* Data for one single layer. See parent component LayeredMap for documentation.
     */
    layer: PropTypes.object,

    /* Add hillshading to an image layer*/
    hillShading: PropTypes.bool,

    /* Coordinates for selected polyline*/
    lineCoords: PropTypes.func,

    /* Coordinates for selected polygon*/
    polygonCoords: PropTypes.func,
};

export default CompositeMapLayer;
