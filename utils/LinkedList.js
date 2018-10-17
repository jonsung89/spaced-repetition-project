'use strict';

// const generateNewQuestions = function(
//   questions,
//   questionLevels,
//   startIndex = 0
// ) {
//   let newArray = [];
//   // find the lowest values in the questionLevel array and push them to newArray
//   let lowestLevel = 5;
//   for (let i = 0; i < questionLevels.length; i++) {
//     if (questionLevels[i].level < lowestLevel) {
//       lowestLevel = questionLevels[i].level;
//     }
//   }
//   // found the lowest level
//   // loop through the questionLevel array to find the question within that index
//   for (let i = startIndex; i < questionLevels.length; i++) {
//     const questionIndex = i % questionLevels.length;
//     if (questionLevels[questionIndex].level === lowestLevel) {
//       newArray.push(questions[questionIndex]);
//     }
//   }
//   return newArray;
// };

// const handleAnswer = function(questions, userData, isCorrect) {
//   const questionIndex = questions.findIndex(answer => {
//     return answer._id.toString() === userData.filteredList[0]._id.toString();
//   });

//   if (isCorrect) {
//     // if correct, go to question levels and increment by 1
//     if (userData.questionLevels[questionIndex].level < 5) {
//       userData.questionLevels[questionIndex].level++;
//     }
//   } else {
//     if (userData.questionLevels[questionIndex].level > 0) {
//       userData.questionLevels[questionIndex].level--;
//     }
//   }
//   userData.filteredList.shift();
//   return userData;
// };

// module.exports = { handleAnswer, generateNewQuestions };

const seedQuestions = require('../db/questions');

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(value) {
    this.head = new _Node(value, this.head);
  }

  insertBefore(valueToInsert, valueToFind) {
    if (!this.head) {
      return null;
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode.value !== valueToFind) {
        previousNode = tempNode;
        tempNode = tempNode.next;
      }
      if (tempNode.next === null) {
        console.log('Item not found');
        return;
      }
      previousNode.next = new _Node(valueToInsert, tempNode);
    }
  }

  insertAfter(valueToInsert, valueToFind) {
    if (!this.head) {
      return null;
    } else {
      let tempNode = this.head;
      let afterNode = tempNode.next;
      while (tempNode.value !== valueToFind) {
        tempNode = tempNode.next;
        afterNode = tempNode.next;
      }
      if (tempNode.next === null) {
        console.log('Item not found');
        return;
      }
      tempNode.next = new _Node(valueToInsert, afterNode);
    }
  }

  insertLast(value) {
    if (this.head === null) {
      this.insertFirst(value);
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode !== null) {
        previousNode = tempNode;
        tempNode = tempNode.next;
      }
      console.log(previousNode);
      previousNode.next = new _Node(value, tempNode);
    }
  }

  insertAt(value, whereToInsert) {
    if (whereToInsert === 1) {
      this.insertFirst(value);
    } else {
      let tempNode = this.head;
      let count = 1;
      let previousNode = tempNode;
      while (count !== whereToInsert) {
        previousNode = tempNode;
        tempNode = tempNode.next;
        count++;
      }
      previousNode.next = new _Node(value, tempNode);
    }
  }

  find(value) {
    // traverse the list, checking each item if it's that value
    let currentNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currentNode.value !== value) {
      if (currentNode.next === null) {
        return null;
      } else {
        currentNode = currentNode.next;
      }
    }
    return currentNode;
  }

  deleteFirst() {
    // returns the first
    if (!this.head) {
      return null;
    } else {
      this.head = this.head.next;
    }
  }

  peek() {
    return this.head.value;
  }

  deleteEnd() {
    if (!this.head) {
      return null;
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode !== null) {
        previousNode = tempNode;
        tempNode = tempNode.next;
      }
      previousNode.next = null;
    }
  }

  deleteItem(value) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === value) {
      this.deleteFirst();
    } else {
      let tempNode = this.head;
      let previousNode = tempNode;
      while (tempNode !== null && tempNode.value !== value) {
        previousNode = tempNode;
        tempNode = tempNode.next;
      }
      if (tempNode === null) {
        console.log('Item not found');
        return;
      }
      previousNode.next = tempNode.next;
    }
  }
}

function createLinkedList() {
  // this only creates the new LinkedList from scratch, does not grab the local question data per user
  const questionLinkedList = new LinkedList();
  for (let i = 0; i < seedQuestions.length; i++) {
    questionLinkedList.insertFirst(seedQuestions[i]);
  }
  return questionLinkedList;
}

const questionLinkedList = createLinkedList();
console.log(questionLinkedList);

module.exports = questionLinkedList;
