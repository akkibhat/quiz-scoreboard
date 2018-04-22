/**
 * Popup for Pub Quiz Scoreboard
 * Displays a screen for each round
 * © Akki Ogra 2018+
 * akki@ogra.co.nz
 */

$(function() {

  // Deault to the first round
  var currentRound = 0;
  loadData();
  displayRound($('#roundScoresPopup'), 1);

  // Load the table from local storage
  function loadData() {
    if($('#scoreTable').isSaved('teams')) {
      $('#scoreTable').load('teams');
    } else {
      alert("No saved table to load!");
      return;
    }
  }

  // Grab the round names from the stored table
  function getRoundNames() {
    var colCount = 0;
    var roundNames = new Array();

    $('#scoreTable').find('thead th').each(function () {
      if(colCount > 0) {
        roundNames[colCount] = $(this).text();
      }
      colCount++;
    });

    return roundNames;
  }

  // Grab the round scores from the stored table
  function getRoundScores() {
    var roundScores = new Array();
    var item = 0;

    // For every row
    $('#scoreTable').find('tbody tr').each(function () {

      var score = 0;
      var round = 0;
      roundScores[item] = new Array();

      // For every column in the row, 0 is the team name...
      $(this).find('td').each(function() {
        if(round == 0) roundScores[item][round] = $(this).text();
        else {
          var value = parseFloat($(this).text());
          score += value ? value : 0; // Handle NaN
          roundScores[item][round] = score;
        }

        round++;
      });

      item++;

    });

    return roundScores;
  }

  // Display round id in $body
  var roundUpdating = false;
  function displayRound($body, roundID) {

    console.log("Loading round ID: " + roundID);

    // Prevent displaying more than one round at once
    if(roundUpdating) {
      return;
    }
    roundUpdating = true;

    // Read in our data
    var roundNames = getRoundNames();
    var roundScores = getRoundScores();

    // Update the title
    $body.find('#roundScoresTitle').text(roundNames[roundID]);

    // Create a duplicate scores table
    $oldTable = $body.find('#roundScoresTable');
    $newTable = $oldTable.clone();
    $newTable.hide();
    $body.append($newTable);
    $tbody = $newTable.find('tbody');
    $tbody.empty();

    // For each team
    for (var i = 0; i < roundScores.length; i++) {
      $tbody.append("<tr><td>?</td><td>"+roundScores[i][0]+"</td><td>"+roundScores[i][roundID]+"</td></tr>");
    }

    // Display and bind the next button
    if(roundID < roundNames.length - 1) {
      $body.find("#roundForward").show();
      $body.find("#roundForward").unbind('click').click(function() {
        displayRound($('#roundScoresPopup'), roundID + 1);
      });
    } else {
      $body.find("#roundForward").hide();
    }

    // Display and bind the previous button
    if(roundID > 1) {
      $body.find("#roundBackward").show();
      $body.find("#roundBackward").unbind('click').click(function() {
        displayRound($('#roundScoresPopup'), roundID - 1);
      });
    } else {
      $body.find("#roundBackward").hide();
    }

    // Bind refesh to show this rounds data
    $body.find("#reloadRound").unbind('click').click(function() {
      loadData();
      displayRound($('#roundScoresPopup'), roundID);
    });

    // Order the results table
    $newTable.animatedSort();

    // Update the numbering
    $newTable.updateRank();

    // Animate the swap from $oldTable to $newTable
    $oldTable.rankingTableUpdate($newTable, {
      onComplete: function(){
        console.log("Complete Round Table");
        roundUpdating = false;
      }
    });

  }


});