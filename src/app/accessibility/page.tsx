"use client";

import QuizButton from "@/common/quizButton"
import styles from "@/common/common.module.css";
import { useEffect, useState } from "react";
import Navbar from "@/common/navbar";

interface QuestionType {
  question: string;
  options: string[];
  answer: string;
}

interface QuizType {
  title: string;
  icon: string;
  questions: QuestionType[];
}

const letters = ["A", "B", "C", "D"];

const AccessQuiz = () => {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error("No data");
      }
      const data: QuizType[] = await response.json();
      const accessibilityQuiz = data.find((q) => q.title === "Accessibility");
      if (!accessibilityQuiz) {
        throw new Error("HTML quiz not found");
      }
      return accessibilityQuiz;
    } catch (e) {
      setError("Failed to load quiz data...");
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizData = await fetchData();
      if (quizData) {
        setQuiz(quizData);
      }
      setIsLoading(false);
    };
    fetchQuiz();
  }, []);

  const handleButtonClick = (option: string) => {
    if (isQuestionAnswered) return;

    setSelectedOption(option);
    setIsQuestionAnswered(true);

    if (option === quiz?.questions[currentQuestionIndex].answer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!isQuestionAnswered) return;

    if (currentQuestionIndex < (quiz?.questions.length || 1) - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsQuestionAnswered(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleNewQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsQuestionAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  if (isLoading) {
    return <div className={styles.loader}></div>;
  }

  if (error || !quiz) {
    return <p>{error || "Failed to load quiz"}</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <main className="grid place-items-center min-h-screen my-12">
      <div className={styles.quiz_ctn}>
        <Navbar
          text="HTML"
          svg={<svg className="w-5 sm:w-10 h-5 sm:h-10" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M24.5075 7.60749C24.6576 7.67412 24.793 7.76966 24.9062 7.88865C25.0193 8.00763 25.1078 8.14774 25.1668 8.30096C25.2258 8.45418 25.254 8.61752 25.2498 8.78164C25.2457 8.94577 25.2092 9.10746 25.1425 9.25749L15.1425 31.7575C15.0079 32.0605 14.7585 32.2976 14.449 32.4167C14.1396 32.5358 13.7955 32.5271 13.4925 32.3925C13.1895 32.2579 12.9524 32.0084 12.8333 31.699C12.7142 31.3896 12.7229 31.0455 12.8575 30.7425L22.8575 8.24249C22.9242 8.09245 23.0197 7.95699 23.1387 7.84387C23.2577 7.73075 23.3978 7.64218 23.551 7.58321C23.7042 7.52424 23.8676 7.49604 24.0317 7.5002C24.1958 7.50437 24.3575 7.54083 24.5075 7.60749ZM10.8325 13.44C10.955 13.5493 11.0547 13.6817 11.126 13.8296C11.1973 13.9774 11.2388 14.1379 11.2481 14.3018C11.2574 14.4657 11.2343 14.6298 11.1801 14.7848C11.126 14.9397 11.0419 15.0825 10.9325 15.205L6.67503 20L10.9375 24.795C11.0465 24.9178 11.1303 25.0608 11.184 25.216C11.2377 25.3711 11.2603 25.5353 11.2506 25.6992C11.2408 25.8631 11.1989 26.0235 11.1272 26.1712C11.0554 26.3189 10.9553 26.451 10.8325 26.56C10.7097 26.669 10.5667 26.7527 10.4115 26.8064C10.2564 26.8602 10.0922 26.8828 9.92829 26.873C9.76439 26.8633 9.60402 26.8214 9.45633 26.7496C9.30864 26.6779 9.17653 26.5778 9.06753 26.455L4.06753 20.83C3.86439 20.6012 3.7522 20.3059 3.7522 20C3.7522 19.6941 3.86439 19.3988 4.06753 19.17L9.06753 13.545C9.17651 13.4222 9.30862 13.322 9.45631 13.2503C9.604 13.1785 9.76437 13.1366 9.92828 13.1268C10.0922 13.1171 10.2564 13.1397 10.4116 13.1935C10.5667 13.2472 10.7098 13.331 10.8325 13.44ZM29.17 13.44C29.2928 13.331 29.4359 13.2472 29.591 13.1935C29.7462 13.1397 29.9104 13.1171 30.0743 13.1268C30.2382 13.1366 30.3986 13.1785 30.5463 13.2503C30.6939 13.322 30.8261 13.4222 30.935 13.545L35.935 19.17C36.1382 19.3988 36.2504 19.6941 36.2504 20C36.2504 20.3059 36.1382 20.6012 35.935 20.83L30.935 26.455C30.826 26.5778 30.6939 26.6779 30.5462 26.7496C30.3985 26.8214 30.2382 26.8633 30.0743 26.873C29.9104 26.8828 29.7462 26.8602 29.591 26.8064C29.4359 26.7527 29.2928 26.669 29.17 26.56C29.0472 26.451 28.9471 26.3189 28.8754 26.1712C28.8037 26.0235 28.7617 25.8631 28.752 25.6992C28.7422 25.5353 28.7649 25.3711 28.8186 25.216C28.8723 25.0608 28.956 24.9178 29.065 24.795L33.3275 20L29.065 15.205C28.956 15.0822 28.8722 14.9392 28.8185 14.784C28.7648 14.6289 28.7421 14.4646 28.7519 14.3007C28.7616 14.1368 28.8036 13.9765 28.8753 13.8288C28.9471 13.6811 29.0472 13.549 29.17 13.44Z" fill="#FF7E35" />
          </svg>}
          svgBgColor="#FFF1E9"
        />
        <div className={styles.questions_ctn}>
          {isQuizCompleted ? (
            <div className="flex flex-col">
              <p className="max-w-[465px] w-full font-[300] text-[36px] md:text-[64px] text-[#313E51]">
                Quiz completed <span className="font-[500] text-[#313E51]">You scored...</span>
              </p>
              <div className="flex flex-col p-12 bg-[#fff] shadow-custom rounded-[24px]">
                <div className="flex items-center justify-center gap-6">
                  <div className={`${styles.svg} bg-[#FFF1E9]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M24.5075 7.60749C24.6576 7.67412 24.793 7.76966 24.9062 7.88865C25.0193 8.00763 25.1078 8.14774 25.1668 8.30096C25.2258 8.45418 25.254 8.61752 25.2498 8.78164C25.2457 8.94577 25.2092 9.10746 25.1425 9.25749L15.1425 31.7575C15.0079 32.0605 14.7585 32.2976 14.449 32.4167C14.1396 32.5358 13.7955 32.5271 13.4925 32.3925C13.1895 32.2579 12.9524 32.0084 12.8333 31.699C12.7142 31.3896 12.7229 31.0455 12.8575 30.7425L22.8575 8.24249C22.9242 8.09245 23.0197 7.95699 23.1387 7.84387C23.2577 7.73075 23.3978 7.64218 23.551 7.58321C23.7042 7.52424 23.8676 7.49604 24.0317 7.5002C24.1958 7.50437 24.3575 7.54083 24.5075 7.60749ZM10.8325 13.44C10.955 13.5493 11.0547 13.6817 11.126 13.8296C11.1973 13.9774 11.2388 14.1379 11.2481 14.3018C11.2574 14.4657 11.2343 14.6298 11.1801 14.7848C11.126 14.9397 11.0419 15.0825 10.9325 15.205L6.67503 20L10.9375 24.795C11.0465 24.9178 11.1303 25.0608 11.184 25.216C11.2377 25.3711 11.2603 25.5353 11.2506 25.6992C11.2408 25.8631 11.1989 26.0235 11.1272 26.1712C11.0554 26.3189 10.9553 26.451 10.8325 26.56C10.7097 26.669 10.5667 26.7527 10.4115 26.8064C10.2564 26.8602 10.0922 26.8828 9.92829 26.873C9.76439 26.8633 9.60402 26.8214 9.45633 26.7496C9.30864 26.6779 9.17653 26.5778 9.06753 26.455L4.06753 20.83C3.86439 20.6012 3.7522 20.3059 3.7522 20C3.7522 19.6941 3.86439 19.3988 4.06753 19.17L9.06753 13.545C9.17651 13.4222 9.30862 13.322 9.45631 13.2503C9.604 13.1785 9.76437 13.1366 9.92828 13.1268C10.0922 13.1171 10.2564 13.1397 10.4116 13.1935C10.5667 13.2472 10.7098 13.331 10.8325 13.44ZM29.17 13.44C29.2928 13.331 29.4359 13.2472 29.591 13.1935C29.7462 13.1397 29.9104 13.1171 30.0743 13.1268C30.2382 13.1366 30.3986 13.1785 30.5463 13.2503C30.6939 13.322 30.8261 13.4222 30.935 13.545L35.935 19.17C36.1382 19.3988 36.2504 19.6941 36.2504 20C36.2504 20.3059 36.1382 20.6012 35.935 20.83L30.935 26.455C30.826 26.5778 30.6939 26.6779 30.5462 26.7496C30.3985 26.8214 30.2382 26.8633 30.0743 26.873C29.9104 26.8828 29.7462 26.8602 29.591 26.8064C29.4359 26.7527 29.2928 26.669 29.17 26.56C29.0472 26.451 28.9471 26.3189 28.8754 26.1712C28.8037 26.0235 28.7617 25.8631 28.752 25.6992C28.7422 25.5353 28.7649 25.3711 28.8186 25.216C28.8723 25.0608 28.956 24.9178 29.065 24.795L33.3275 20L29.065 15.205C28.956 15.0822 28.8722 14.9392 28.8185 14.784C28.7648 14.6289 28.7421 14.4646 28.7519 14.3007C28.7616 14.1368 28.8036 13.9765 28.8753 13.8288C28.9471 13.6811 29.0472 13.549 29.17 13.44Z" fill="#FF7E35" />
                    </svg>
                  </div>
                  <p className="font-[500] text-base sm:text-[28px]">HTML</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <p className="text-[76px] md:text-[144px] font-[500]">{score}</p>
                  <p className="text-[24px] font-[400] text-[#626C7F]">out of {quiz.questions.length}</p>
                </div>
              </div>
              <button
                onClick={handleNewQuiz}
                className="mt-8 bg-[#A729F5] w-full text-[#fff] text-[28px] font-[500] p-3 sm:p-5 rounded-[24px] shadow-custom outline-none hover:opacity-50"
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-between gap-10 md:gap-0 sm:pb-[10%]">
                <div>
                  <p className="italic font-[400] text-[20px] text-[#626C7F] mb-[27px]">
                    Question {currentQuestionIndex + 1} out of {quiz.questions.length}
                  </p>
                  <p className="max-w-[465px] w-full text-[36px] font-[500] text-[#313E51]">
                    {currentQuestion.question}
                  </p>
                </div>
                <span className="max-w-[465px] w-full h-4 bg-[#fff] p-1 rounded-full shadow-custom">
                  <div
                    className={`${styles.progress_bar} h-full bg-[#A729F5] rounded-full`}
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </span>
              </div>
              <div className="w-[564px]">
                {currentQuestion.options.map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="mb-6 w-full">
                    <QuizButton
                      key={optionIndex}
                      text={option}
                      svg={letters[optionIndex]}
                      svgBgColor="#F4F6FA"
                      isClicked={selectedOption === option}
                      onClick={() => handleButtonClick(option)}
                      isCorrect={isQuestionAnswered ? option === currentQuestion.answer : undefined}
                    />
                  </div>
                ))}
                <button
                  onClick={handleNextQuestion}
                  disabled={!isQuestionAnswered}
                  className={`mt-2 bg-[#A729F5] w-full text-[#fff] text-[28px] font-[500] p-5 rounded-[24px] shadow-custom outline-none ${isQuestionAnswered ? 'hover:opacity-50' : 'opacity-50 cursor-not-allowed'}`}
                >
                  {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default AccessQuiz;