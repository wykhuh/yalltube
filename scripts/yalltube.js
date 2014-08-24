
(function(){
  var myData, usersQuery, $linkInput, $links, $linksContainer, $error, $linkSubmit;
  var maxVideos = 6;
  var counter=0;

  // set up Firebase connection 
  myData = new Firebase("https://yalltube.firebaseio.com");

  // set up jQuery selections
  $linkInput = $('#linkInput');
  $links = $('.video');
  $linksContainer = $('#linksContainer');
  $error = $('.error');
  $linkSubmit = $('.linkSubmit');

  // sends data to Firebase when user hits return
  $linkInput.keypress(function(e){
    $error.text('');
    if(e.keyCode == 13) {
      submitLink(e);
    }
  });

  // sends data to Firebase when submit is click
  $linkSubmit.on('click' , function(e) {
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

  // takes the normal Youtube link and converts it to an 
  // embedded video link
  var convertLink = function (link) {
    var newlink=  link.replace('/watch?v=', '/embed/');
    return newlink;
  };

  // adds link to the DOM
  var renderLink = function (link) {
    $('<div class="video"><iframe width="450" height="253" src="'
      + filterXSS(convertLink(link))
      +'?autoplay=1" frameborder="0" allowfullscreen></iframe></div>')
      .prependTo($('#linksContainer'));
  };

  // retrieve the last [number] items from Firebase
  usersQuery = myData.limit(maxVideos);

  // when item is added to Firebase, add the link to the page
  usersQuery.on('child_added', function(snapshot) {
    var data = snapshot.val();
    renderLink(data.link);
    counter++;

    // remove the oldest link from the page if there are more 
    // than maxVideos number of items on page
    if($('.video').length > maxVideos) {
      $('.video:last').remove();
    }
  });
}());