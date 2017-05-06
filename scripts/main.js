$(function () {
  var $body = $(document.body);
  var $entries = $('#entries');

  var _totalLoaded = 0;

  var profiles = [];

  $.get('profiles/profiles.json')
    .done(function (data) {
      profiles = data;
      loadProfiles();
    })
    .fail(function () {
      alert('Failed to load Photódex information!');
    });

  function loadProfiles() {
    for (var i = 0; i < profiles.length; i++) {
      var profile = profiles[i];
      buildEntry(profile).appendTo($entries);
    }
  }

  function buildEntry(profile) {
    var $entry = $('<a/>', {
      "class": 'entry',
      href: photodexUrl(profile),
      target: '_blank'
    }).append($('<img/>', {
      "class": 'profile',
      src: 'profiles/' + profile.username + '.png'
    })).append($('<div/>', {
      "class": 'team-badge ' + profile.team
    }));;

    $userInfo = $('<div/>', {
      "class": 'user-info',
      text: profile.username
    }).appendTo($entry);

    addSnapCount($userInfo, profile);
    return $entry;
  }

  function addSnapCount($userInfo, profile) {
    var profileSnapsUrl = photodexUrl(profile) + '/snaps/snaps.json';
    $.get(profileSnapsUrl).done(function (data) {
      $userInfo.text($userInfo.text() + ' (' + data.length + ')');
    }).always(function () {
      incrementTotalLoaded();
    });
  }

  function photodexUrl(profile) {
    return 'http://' + profile.username.toLowerCase() + '.photodex.io';
  }

  function incrementTotalLoaded() {
    _totalLoaded++;
    if (_totalLoaded === profiles.length) {
      onLoaded();
    }
  }

  function onLoaded() {
    $body.removeClass('loading');
  }
});