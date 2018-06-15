$(function() {
   $('#icon').hide();

   $('#userDialogueText').on('keypress', (e) => {
      if (e.which != 13) {
         return true;
      }
      let userDialogue = $('#userDialogueText').val();
      //console.log("User dialogue", userDialogue );
      let answerIndex = 0;
      let answer = userDialogue + '? Not enough to think about, really';
      try {
         answerIndex = getApproxDialogue(userDialogue, dialogue) + 1;
         //console.log("Answer index: ", answerIndex);
         //console.log("Answer = " + dialogue[answerIndex]);

         answer = dialogue[answerIndex];
         if (dialogue[answerIndex].endsWith('...')) {
            //console.log("Answer 1 = " + dialogue[answerIndex + 1]);
            answer.concat(dialogue[answerIndex + 1]);
         }

         answer = replaceNouns(answer, userDialogue);

      } catch(err) {
      }

      let answerHtml = '<p><b>You: </b><span class="">' + userDialogue + '</span>';
      appendChatResponse(answerHtml);
      $('#inputDiv').addClass('loading');
      $('#icon').show();
      setTimeout(() => {
         answerHtml = '<p><b>Avengers: </b><span class="">' + answer + '</span>';
         appendChatResponse(answerHtml);
         $('#inputDiv').removeClass('loading');
         $('#icon').hide();
      }, 1000 * getRandomInt(3));

      $('#userDialogueText').val('');
      return true;
   });

   function appendChatResponse(str) {
      let prevHtml = $('#output-content').html();
      $('#output-content').html(prevHtml + str);
   }

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
         // console.debug("Evaluating: ", randomSystemDialogue);
         systemDialoguePos = getPos(randomSystemDialogue);
         let score = calcScore(userDialoguePos, systemDialoguePos);
         if (score < 3.0) {
            continue;
         }
         //console.log("Found system dialog with same number of nouns: ", randomSystemDialogue);
         //console.debug("System dialog pos: ", systemDialoguePos);
         isMatch = true;
      }
      return index;
   }

   function calcScore(arr1, arr2) {
      let score = 0;
      let arr1Group = _.countBy(arr1);
      let arr2Group = _.countBy(arr2);
      // console.debug("arr1Group", arr1Group);
      // console.debug("arr2Group", arr2Group);
      _.mapObject(arr1, (key, val) => {
         //console.debug("checking key ", key);
         if (arr2Group[key] != undefined) {
            score += (1.0 - ((arr1Group[key] - arr2Group[key])/(arr1Group[key] + arr2Group[key])));
            //console.debug("Score = ", score);
         }
      });
      return score;
   }

   function extractNouns(str) {
      let ris = new RiString(str);
      let words = ris.words();
      let pos = ris.pos();
      let res = [];
      for (let i = 0; i < words.length; i++) {
         if (pos[i] === 'nn') {
            res.push(words[i]);
         }
      }
      return res;
   }

   function replaceNouns(target, source) {
      // console.debug('source', source);
      // console.debug('target', target);
      let sourceNouns = extractNouns(source);
      let targetNouns = extractNouns(target);
      // console.debug("Source Nouns ", sourceNouns);
      // console.debug("Target Nouns ", targetNouns);

      let ris = new RiString(target);
      let words = ris.words();
      let pos = ris.pos();
      let count = sourceNouns.length;
      for (let i = 0; i < words.length; i++) {
         // console.debug("Should I replace : ", words[i]);
         if (pos[i] === 'nn') {
            let randomSourceNoun = _.sample(sourceNouns);
            // console.debug("Replacing %s with %s", words[i], randomSourceNoun);
            words[i] = randomSourceNoun;
            count -= 1;
         }
         if (count <= 0) {
            break;
         }
      }

      // console.debug('new target', words);
      return words.join(' ');
   }

});
