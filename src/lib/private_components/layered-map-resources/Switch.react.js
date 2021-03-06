import L from "leaflet";
import React from "react";
import ReactDOM from "react-dom";
import { withLeaflet, MapControl } from "react-leaflet";
import PropTypes from "prop-types";
import MaterialSwitch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class Switch extends MapControl {
    constructor(props) {
        super(props);
        this.state = { checked: this.props.checked };

        const { map } = this.props.leaflet;
        this.leafletElement.addTo(map);
    }

    handleChange() {
        this.setState({ checked: !this.state.checked });
        this.props.onChange();
    }

    createLeafletElement(props) {
        const MapInfo = L.Control.extend({
            onAdd: () => {
                this.panelDiv = L.DomUtil.create(
                    "div",
                    "leaflet-custom-control"
                );
                return this.panelDiv;
            },
        });
        return new MapInfo({ position: props.position });
    }

    componentDidMount() {
        // Overriding default MapControl implementation. We need to do the
        // addTo(map) call in the constructor in order for the portal
        // DOM node to be available for the render function.
    }

    render() {
        return ReactDOM.createPortal(
            <FormControlLabel
                control={
                    <MaterialSwitch
                        onClick={this.handleChange.bind(this)}
                        checked={this.state.checked}
                    />
                }
                label={this.props.label}
                style={{ paddingLeft: "10px" }}
            />,
            this.panelDiv
        );
    }
}

Switch.propTypes = {
    /* Label to be shown to the right of the switch */
    label: PropTypes.string,

    /* Callback function to call when switch changes */
    handleChange: PropTypes.func,

    /* Initial value of the swith */
    checked: PropTypes.bool,
};

export default withLeaflet(Switch);
