/* global ReactDOM React */

const destination = document.getElementById('app');
let globalVar = {};

class WikiViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      results: []
    };
    this.inputChange = this.inputChange.bind(this);
    this.getJsonP = this.getJsonP.bind(this);
  }
  openRandom(e) {
    e.preventDefault();
    window.open('https://en.wikipedia.org/wiki/Special:Random');
  }
  componentWillMount() {
    globalVar.callback = (data) => {
      this.setState({ results: Object.values(data.query.pages) });
    };
  }
  inputChange(e) {
    e.preventDefault();
    this.setState({ search: e.target.value });
  }
  getJsonP() {
    if (!this.state.search) {
      return;
    }
    const limit = 20;
    const searching = this.state.search;
    const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=max&format=json&exsentences=1&exintro=&explaintext=&generator=search&gsrlimit=' + limit + '&gsrsearch=' + searching + '&callback=writeRes';
    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }
  render() {
    const wikilink = 'http://en.wikipedia.org/?curid=';
    const title = {
      fontFamily: "'Righteous','arial',sans-serif",
      fontSize: "1.8em"
    };
    const resultList = this.state.results.map(function (d) {
      return (
        <div className="article" key={d.pageid}>
          <div className="bold">
            <a href={wikilink + d.pageid}>{d.title}</a>
          </div>
          <div>{d.extract}</div>
        </div>
      );
    });
    return (
      <div className="plugin">
        <div className="head">
          <div className="left">
            <img className="limage" alt="" src="/_assets/images/wiki130x150.png" />
          </div>
          <div className="right">
            <div className="title" style={title}>
              <span>Wikipedia Viewer</span>
            </div>
            <div className="random">
              <button id="random" onClick={this.openRandom} className="btnRnd">Random Article</button>
            </div>
            <div className="search">
              <input id="searchBox" placeholder="search in wikipedia"
                value={this.state.search} onChange={this.inputChange} />
              <button onClick={this.getJsonP} className="btnSea">Search</button>
            </div>
          </div>
        </div>
        <div className="articles">
          {this.state.results.length > 0 &&
            resultList
          }
        </div>
      </div>
    );
  }
}

const layout = (
  <div>
    <WikiViewer />
  </div>
);

ReactDOM.render(
  layout,
  destination
);

function writeRes(data) {
  globalVar.callback(data);
}
