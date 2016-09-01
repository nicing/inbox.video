'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var FormatDate = require('../utils/FormatDate');
var Player = require('./Player.jsx');
var Helper = require('./Helper.jsx');

var Detail = React.createClass({
  mixin: [Helper],
  getDefaultProps: function() {
    return {
      detail: {}
    };
  },
  handleMark: function(status) {
    ActionCreator.markAs(this.props.currentChannel.channelId, [this.props.detail.id], status);
  },
  like: function() {
    ActionCreator.like(this.props.detail, this.props.likes);
  },
  share: function() {
    var title = 'Inbox.Video';
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=http%3A%2F%2Finbox.video%2F';
    ActionCreator.openLink(url);
  },
  clickLink: function(url) {
    ActionCreator.openLink(url);
  },
  toggleFullScreen: function() {
    ActionCreator.toggleFullScreen();
  },
  donate: function() {
    React.findDOMNode(this.refs.donation).submit();
  },
  render() {
    var {detail} = this.props;
    var {likes} = this.props;
    var {isWatched} = this.props;
    var {selectedChannelId} = this.props;
    var {currentChannel} = this.props;
    var {fullScreen} = this.props;
    var isSelectedChannel = selectedChannelId && selectedChannelId !== 'browse';

    var detailName = detail.snippet ? detail.snippet.title : '';
    var description = detail.snippet ? detail.snippet.description : '';

    var isPlaylist = ActionCreator.isPlaylist(selectedChannelId);
    var isSelectedVideo = !!detail.id;
    var url = detail.id ? ActionCreator.generatePlayerUrl(detail.id) : '';
    var playerUrl = detail.id ? ActionCreator.generatePlayerUrl(detail.id, 1) : '';

    var className;
    var tipsClass = 'tips';
    var controlClass = 'control detail-control';
    var markAsClass = isPlaylist ? 'mark-as hide' : 'mark-as';
    var likeClass = 'fa fa-heart-o';

    if (detail.id && detail.id in likes.videos) {
      likeClass = 'fa fa-heart';
    }

    if (isSelectedChannel && isSelectedVideo) {
      className = 'detail with-bg';
    } else if (isSelectedChannel && !isSelectedVideo) {
      className = 'detail not-select-video';
    } else {
      className = 'detail hide';
    }

    if (fullScreen) {
      controlClass += ' fullscreen-mode';
      tipsClass += ' hide';
    }

    return (
      <div className={className}>
        <div className="content">
          <h2 className="detail-name">{detailName}</h2>
          <p className={isWatched ? "update-date" : "update-date unwatched"}>{FormatDate.format('yyyy-MM-dd HH:mm', detail.snippet ? new Date(detail.snippet.publishedAt).getTime() : 0)} by {detail.snippet ? detail.snippet.channelTitle : ''}</p>
          <Player url={playerUrl} fullScreen={fullScreen} />
          <p className="source">Source： <a href="javascript:void(0)" onClick={this.clickLink.bind(this, url + '&feature=' + location.hostname)}>{url}</a></p>
          <div className="description">
            <pre className="description-text">{description}</pre>
          </div>
          <Helper />
        </div>
        <div className={controlClass}>
          <span className="icon icon-fullscreen" onClick={this.toggleFullScreen}></span>
          <div className={markAsClass}>
            Mark as：
           <button className="mark-button" onClick={this.handleMark.bind(this, 'watched')}>Watched</button>
           <button className="mark-button" onClick={this.handleMark.bind(this, 'unwatched')}>Unwatched</button>
          </div>
          <span className="icon icon-like" onClick={this.like}><i className={likeClass}></i></span>
        </div>
        <div className={tipsClass}>
          <p>Made with <i className="fa fa-heartbeat fa-fw"></i> by <a href="javascript:void(0)" onClick={this.clickLink.bind(this, 'http://leplay.net/')}>Leplay</a> in Beijing.</p>
        </div>
      </div>
    );

  }
});

module.exports = Detail;
