var CamperLeaderboard = React.createClass({
  render: function() {
    return (
      <div className="container camper-leaderboard">
        <div className="page-header h1">Free Code Camp<i className="fa fa-free-code-camp" aria-hidden="true"></i>
          points board
        </div>
          <CamperTablePanel urls={this.props.urls}/>
      </div>
    );
  }
});

var CamperTablePanel = React.createClass({
  render: function() {
    return (
      <div className="camper-table-panel">
        
        <CamperTable urls={this.props.urls}/>
      </div>
    );
  }
});

var CamperTable = React.createClass({
  
  getFccUserScores: function() {
    var _this = this;
    this.serverRequest =
      axios.all([axios.get(_this.props.urls[0]), axios.get(_this.props.urls[1])])
      .then(axios.spread(function(last30, all) {
        _this.setState({
          recent: last30.data,
          alltime: all.data
        });
      }));
  },
  getInitialState: function() {
    return {
      showRecent: true,
      recent: [],
      alltime: []
    }
  },
  handlePointsInLast30Days: function() {
    this.setState({
      showRecent: true
    });
  },
  handleAllTimePoints: function() {
    this.setState({
      showRecent: false
    });
  },
  componentDidMount: function() {
    this.getFccUserScores();
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    var rows = [];
    if(this.state.showRecent) {
      this.state.recent.forEach(function(_camper, index) {
        rows.push(<CamperRow camper={_camper} position={index+1} />);
      });
    }
    else {
      this.state.alltime.forEach(function(_camper, index) {
        rows.push(<CamperRow camper={_camper} position={index+1} />);
      });      
    }
    return (
      <table className="table">
            <CamperTableHeader
              onClickLast30Days={this.handlePointsInLast30Days}
              onClickAllTime={this.handleAllTimePoints}
              showRecent={this.state.showRecent}
              />
            <tbody>{rows}</tbody>
      </table>
    );
  }
});

var CamperTableHeader = React.createClass({
  
  handlePointsInLast30Days: function() {
    this.props.onClickLast30Days();
  },
  handleAllTimePoints: function() {
    this.props.onClickAllTime();
  },

  render: function() {  
    const showRecent = this.props.showRecent;
    return (
      <thead>
          <tr>
            <th>#</th>
            <th>Camper</th>
            <th>
              <a 
                onClick={this.handlePointsInLast30Days}
                >{ showRecent &&
                    <i className="fa fa-sort-amount-desc" aria-hidden="true"></i> 
                 }
                last 30 days             
              </a>
            </th>
            <th>
              <a 
                onClick={this.handleAllTimePoints}
                >{ !showRecent &&
                <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
                  }
                all time    
              </a>
            </th>
          </tr>
        </thead>
    )
  }
});

var CamperRow = React.createClass({
  render: function() {
    var camperLink = "https://www.freecodecamp.com/" + this.props.camper.username;
    return (
      <tr>
          <td>{this.props.position}</td>
          <td><a href={camperLink} target="_blank"><img className="img img-responsive camper-img" src={this.props.camper.img} />{this.props.camper.username}</a></td>
          <td>{this.props.camper.recent}</td>
          <td>{this.props.camper.alltime}</td>
        </tr>
    )
  }
});

ReactDOM.render(
  <CamperLeaderboard urls={[`https://fcctop100.herokuapp.com/api/fccusers/top/recent`, `https://fcctop100.herokuapp.com/api/fccusers/top/alltime`]}/>,
  document.getElementById("content")
);