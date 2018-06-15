$(function() {

   $('#userDialogueText').on('keypress', (e) => {
      if (e.which != 13) {
         return true;
      }
      let userDialogue = $('#userDialogueText').val();
      //console.log("User dialogue", userDialogue );
      let answerIndex = 0;
      let answer = 'Not enough to think about, really';
      try {
         answerIndex = getApproxDialogue(userDialogue, dialogue) + 1;
         //console.log("Answer index: ", answerIndex);
         //console.log("Answer = " + dialogue[answerIndex]);

         answer = dialogue[answerIndex];
         if (dialogue[answerIndex].endsWith('...')) {
            //console.log("Answer 1 = " + dialogue[answerIndex + 1]);
            answer.concat(dialogue[answerIndex + 1]);
         }

      } catch(err) {
      }

      let answerHtml = '<br/><h3>You: ' + userDialogue + '</h3>';
      answerHtml += '<h3>Avengers: ' + answer + '</h3>';

      let prevHtml = $('#output').html();
      $('#output').html(answerHtml + prevHtml);

      $('#userDialogueText').val('');
      return true;
   });

   function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
   }

   function getPos(str) {
      var ris = new RiString(str);
      return ris.pos();
   }

   function getApproxDialogue(userDialogue, systemDialogue) {
      var userDialoguePos = getPos(userDialogue);
      //console.debug("User dialog pos", userDialoguePos);
      var index = 0;
      var randomSystemDialogue = "";
      var systemDialoguePos = [];
      var isMatch = false;

      while (isMatch == false) {
         index = getRandomInt(systemDialogue.length);
         randomSystemDialogue = systemDialogue[index];
         //console.debug("Evaluating: ", randomSystemDialogue);
         systemDialoguePos = getPos(randomSystemDialogue);
         let d = dist(userDialoguePos, systemDialoguePos);
         //console.debug("Distance: ", d);
         if (d < 3.0) {
            continue;
         }
         //console.log("Found system dialog with same number of nouns: ", randomSystemDialogue);
         //console.debug("System dialog pos: ", systemDialoguePos);
         isMatch = true;
      }
      return index;
   }

   function countNouns(posArray) {
      let count = 0;
      for(let i = 0; i < posArray.length; i++) {
         if(posArray[i] === 'nn') {
            count = count + 1;
         }
      }
      return count;
   }

   function dist(arr1, arr2) {
      let score = 0;
      let arr1Group = _.countBy(arr1);
      let arr2Group = _.countBy(arr2);
      //console.debug("arr1Group", arr1Group);
      //console.debug("arr2Group", arr2Group);
      _.mapObject(arr1, (key, val) => {
         //console.debug("checking key ", key);
         if (arr2Group[key] != undefined) {
            score += (1.0 - ((arr1Group[key] - arr2Group[key])/(arr1Group[key] + arr2Group[key])));
            //console.debug("Score = ", score);
         }
      });
      return score;
   }
});
