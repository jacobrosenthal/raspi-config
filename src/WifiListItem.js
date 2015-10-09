let React = require('react/addons');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();

let ListItem = mui.ListItem;

let WifiListItem = React.createClass({
  propTypes: {
    wifi: React.PropTypes.object.isRequired,
    onRow: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  render: function () {
    return (
      <ListItem
      onTouchTap={this.props.onRow}
      primaryText={<span>{this.props.wifi.ssid}</span>}
      secondaryText={<p>{this.props.wifi.ssid.mac}</p>}
      secondaryTextLines={1}/>
    );
  }

});

module.exports = WifiListItem;
