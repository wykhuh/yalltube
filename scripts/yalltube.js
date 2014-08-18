
(function(){
  var myData, $linkDOM, usersQuery, convertLink, displayLink;
  var numVideos = 6;
  var counter=0;

  // set up Firebase connection 
  myData = new Firebase("https://yalltube.firebaseio.com");

  // set up jQuery selections
  $linkInput = $('#linkInput');
  $links = $('.video');
  $linksContainer = $('#linksContainer');
  $error = $('.error');

  // sends data to Firebase when user hits return
  $linkInput.keypress(function(e){
    $error.text('');
    if(e.keyCode == 13) {
      submitLink(e);
    }
  });

  // sends data to Firebase when submit is click
  $('.linkSubmit').on('click' , function(e) {
    $error.text('');
    submitLink(e);
  });

  //validates user input and send data to Firebase
  var submitLink = function(e){
    e.preventDefault();
    // if link is a valid youtube link 
    if(/youtube\.com\/watch/.test($linkInput.val())){
      // send data to Firebase
      myData.push({link: $linkInput.val() });
      // clears input field
      $linkInput.val('');
    // else show error
    } else {
      $error.append('Must be YouTube link.');
    }
  };

  // only retrive the last [number] items from Firebase
  usersQuery = myData.limit(numVideos);

  // when item is added to Firebase, add the link to the page
  usersQuery.on('child_added', function(snapshot) {
    var link = snapshot.val();
    renderLink(link.link);
    counter++;

    // remove the oldest link from the page if there are more 
    // than [number] of items on page
    if(counter > numVideos) {
      $linksContainer.children()[numVideos].remove();
    }

  });

  // takes the normal Youtube link and converts it to an 
  // embedded video link
  convertLink = function (link) {
    var newlink=  link.replace('/watch?v=', '/embed/');
    return newlink;
  };

  // adds link to the DOM
  renderLink = function (link) {
    $('<div class="video"><iframe width="450" height="253" src="'
      + filterXSS(convertLink(link))
      +'?autoplay=1" frameborder="0" allowfullscreen></iframe></div>')
      .prependTo($('#linksContainer'));
  };

}());