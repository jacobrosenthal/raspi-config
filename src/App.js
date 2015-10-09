let React = require('react/addons');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

let Card = mui.Card;
let CardHeader = mui.CardHeader;
let CardText = mui.CardText;
let FlatButton = mui.FlatButton;
let AppBar = mui.AppBar;
let List = mui.List;
let Dialog = mui.Dialog;
let TextField = mui.TextField;

let WifiListItem = require('./WifiListItem');
let wpaCli = require('wpa-cli');

let appBarStyle = {
  paddingLeft: 72 // align with listitem text
};

let App = React.createClass({
  getInitialState: function () {
    return {
      wifis: [],
      logs: []
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function () {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });

    this._onRefresh();
  },

  render: function () {
    if (!this.state.wifis.length===0) {
      return this.renderLoadingView();
    }

    let self = this;

    //Standard Actions
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
    ];

    let WifiList = [];
    this.state.wifis.forEach(function (wifi, key) {
      let Wifi = (
        <WifiListItem
        wifi={wifi}
        onRow={self._onSelect.bind(null, wifi)}
        key={key}/>);

      WifiList.push(Wifi);
    });

    let visibleLogs = this.state.logs.length > 5 ? this.state.logs.slice(this.state.logs.length-5) : this.state.logs;

    return (
      <div>
        <AppBar style={appBarStyle} showMenuIconButton={false} title='raspbi-config'
        iconElementRight={<FlatButton label="Refresh" onTouchTap={this._onRefresh} />} />

        <List>
          {WifiList}
        </List>

        <Dialog
          ref='WifiView'
          autoDetectWindowHeight={true} autoScrollBodyContent={true}
          title='Save Wifi'
          actions={standardActions}
          actionFocus='submit'>
          <TextField
            hintText="password"
            defaultValue=""
            onChange={this._onVariableChange}/>
        </Dialog>

        <Card initiallyExpanded={false}>
          <CardHeader
            title="Logs"
            showExpandableButton={true}/>
          <CardText expandable={true}>
            {visibleLogs.map((log, index) =>
              <p key={index}>{log}</p>
            )}
          </CardText>
        </Card>
      </div>
    );
  },

  renderLoadingView: function () {
    return (
      <div>
        <p>
          No wifi detected. Refresh?
        </p>
      </div>
    );
  },

  _onSelect: function (wifi) {
    this._log('_onSelect ' + wifi.ssid);

    this.setState( { wifi } );
    this.refs.WifiView.show();
  },

  _onDialogSubmit: function () {
    var self = this;

    this._log('_onSelect ' + this.state.wifi.ssid + ' ' + this.state.password);

    wpaCli.set(this.state.wifi.ssid, this.state.password, function (error) {
      this._log('wpaCli.set ' + error.message);
      this.refs.WifiView.dismiss();
    });

  },

  _onVariableChange: function (event) {
    this.setState( { password: event.target.value }) ;
  },

  _log: function (text) {
    console.log(text);
    this.setState({ logs: [ ...this.state.logs, text ] });
  },

  _onRefresh: function () {
    this._log('refresh begun');

    let self = this;

    wpaCli.scan(function (err, data) {
      if (err) {
        self._log('update error ' + err.message);
        return;
      }

      self._log('update received');
      self.setState({
        wifis: data
      });
    });
  }
});

module.exports = App;
