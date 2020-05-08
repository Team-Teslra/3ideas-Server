const { questions, answers } = require('../../models');

//? 답변글 선택 요청 ( /ask/selection/질문글id )
module.exports = async (req, res) => {
  const { askId } = req.params;
  // console.log({ askId });
  if (!Number(askId)) {
    //! API ask id가 숫자가 아님
    return res.status(200).json('invalid API');
  }

  //? 입력된 body의 유효성 check
  const { first, second, third } = req.body;

  if (!first || !second || !third) {
    //! first, second, third 셋 중 하나라도 null
    return res.status(400).json('invalid body');
  }

  if (first === second || first === third || second === third) {
    //! first, second, third 셋 중 하나라도 겹치는 값 존재
    return res.status(400).json('invalid answer id selection');
  }

  try {
    //? 질문글의 유효성 check
    let question = await questions.findOne({
      where: { id: askId },
      include: {
        model: answers,
        attributes: ['id'],
      },
    });

    if (!question) {
      //! ask id가 존재하지 않음
      return res.status(400).json('invalid ask id');
    }

    if (!question.questionFlag) {
      //! 이미 닫힌 질문글
      return res.status(422).json('this question is already closed');
    }

    //? answer id들이 해당 question의 answer인지 check
    let validAnswerId = question.answers.reduce((acc, answer) => {
      const answerIds = [Number(first), Number(second), Number(third)];
      // console.log(answerIds);
      // console.log(typeof answer.id, answer.id);
      // console.log(answerIds.includes(answer.id));
      if (answerIds.includes(answer.id)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    // console.log(validAnswerId);

    if (validAnswerId !== 3) {
      //! first, second, third 중 하나 이상이 question에 달린 답변이 아님
      return res.status(422).json('invalid answer id');
    }

    //? 업데이트
    await answers.update({ answerFlag: 1 }, { where: { id: first } });

    await answers.update({ answerFlag: 2 }, { where: { id: second } });

    await answers.update({ answerFlag: 3 }, { where: { id: third } });

    await questions.update({ questionFlag: false }, { where: { id: askId } });

    return res.status(200).json(`id:${askId} question closed`);
  } catch (err) {
    return res.status(500).send(err);
  }
};
