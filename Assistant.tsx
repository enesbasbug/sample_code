import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const frontendURL = "http://localhost:3000/"

const Assistant = (props: {gpt: string, paid: boolean, access:boolean}) => {
    const [prompt2, setPrompt2] = useState('');
    const [answers, setAnswers] = useState<{ label: string; content: string }[]>([]); 
    const [gptKeyCurrent, setGptKeyCurrent] = useState('');
    const [isPaidStd, setIsPaidStd] = useState(false); 
    const [showNotification, setShowNotification] = useState(false);
    const [access, setAccess] = useState(false);
    


    useEffect(() => {
        if (!props.gpt) {
            window.location.href = frontendURL;
        } else {
            setGptKeyCurrent(props.gpt);
            setIsPaidStd(props.paid);
            setAccess(props.access)
        }
    }, [props.gpt, props.paid, props.access]);


    const handleButtonClick = async (endpoint: string, label: string) => {
        
        try {
            setShowNotification(true); // Show the notification
            const response = await fetch(`http://localhost:8000/api/assistant/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt_2: prompt2,
                    gptkey: gptKeyCurrent,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newAnswer = { label, content: data.answer };

                // Find the index of the answer with the same label
                const answerIndex = answers.findIndex(answer => answer.label === label);

                if (answerIndex !== -1) {
                    // If an answer with the same label exists, update it
                    const updatedAnswers = [...answers];
                    updatedAnswers[answerIndex] = newAnswer;
                    setAnswers(updatedAnswers);
                } else {
                    // If no answer with the same label exists, add the new answer
                    setAnswers([...answers, newAnswer]);
                }
            } else {
                console.error(`Failed to get response for ${endpoint}`);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowNotification(false); // Hide the notification
        }
    };

    

    return (
        
        <div>
            {showNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div className="bg-[#f8f1e9] p-6 rounded shadow">
                        <p className="text-gray-700 text-lg">Please wait, the programme is processing...</p>
                    </div>
                </div>
            )}

            {(isPaidStd || access) ? (
                <div className='bg-[#ecd4c7]'>
                    <div className="container mx-auto p-4">
                        <div className="bg-[#f8f1e9] rounded-xl  p-8 w-full">
                            <h1 className="text-3xl font-bold text-gray-700 mb-4">Assistance for Your Writings</h1>

                            <form className="mb-8">
                                
                                <div className="mb-4">
                                    <label className="block text-[#b49580] font-semibold mb-2">The text you wrote:</label>
                                    <textarea
                                        value={prompt2}
                                        onChange={(e) => setPrompt2(e.target.value)}
                                        rows={10}
                                        className="w-full p-2 border rounded bg-[#ede2dc] text-gray-700 focus:outline-none focus:border-[#b49580]"
                                        placeholder="Please input the text to be evaluated."
                                    />
                                </div>
                                
                            </form>
                        </div>

                        <div className="bg-[#f8f1e9] rounded-xl  p-8 w-full mt-8">
                            <div className="flex flex-col justify-center items-center gap-x-6 mt-8">
                                {[
                                    { endpoint: 'ask_to_assistance', label: "AI Assistant" },
                                    { endpoint: 'ask_to_error', label: 'Error' },
                                    { endpoint: 'ask_to_lexical', label: 'Lexical Resources' },
                                    { endpoint: 'ask_to_grammatical', label: 'Grammatical Range and Accuracy' }, 
                                    { endpoint: 'ask_to_rewritten_by_AI', label: 'Rewritten by AI' },
                                ].map((action, index) => (
                                    <div key={index} className="bg-[#f8f1e9] rounded shadow flex flex-col justify-center items-center p-4 mb-4  w-full">
                                        <button
                                            type="button"
                                            className="bg-[#b49580] text-gray-700 text-lg hover:bg-[#83634e] hover:text-[#f8f1e9] font-bold py-2 px-4 rounded w-80"
                                            onClick={() => handleButtonClick(action.endpoint, action.label)}
                                            disabled={!prompt2} // Disable the button if prompts are empty

                                        >
                                            {action.label}
                                        </button>
                                        {answers.map((answer, answerIndex) =>
                                            answer.label === action.label && (
                                                <div key={answerIndex} className="mt-4">
                                                    <div className='flex gap-x-6'>
                                                            <div className='w-1/2'>
                                                                <h2 className="text-xl text-[#b49580] font-semibold mb-2">{answer.label} - Answer:</h2>
                                                                <p className='text-gray-700' style={{ whiteSpace: 'pre-line' }}>{answer.content}</p>
                                                            </div>
                                                            <div className='w-1/2'> 
                                                                <h2 className="text-xl text-[#b49580] font-semibold mb-2">Your Answer:</h2>
                                                                <p className='text-gray-700' style={{ whiteSpace: 'pre-line' }}>{prompt2}</p>
                                                            </div>
                                                        </div>
                                                    <hr className='border-[#b49580] opacity-40 mt-4' /> 
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
                ) : (
                    
                    <div className='text-gray-700'>
                            <div className='max-w-[1200px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center items-center'>
                                <h1 className='font-bold text-2xl text-[#b49580]'>We kindly ask for a payment to use the special writing score feature.</h1>
                                <br />
                                <h2 className='text-gray-700 text-4xl '>You're welcome to complete your payment right here!</h2>
                                <button
                                className='bg-[#b49580] text-black text-lg hover:bg-[#83634e] hover:text-[#f8f1e9] p-2 mt-10 w-1/4 rounded '
                                  // Navigate to the custom checkout page
                                >
                                    <Link to='/cards'>Make payment</Link>
                                    
                                </button>
                                <br />
                                <br />
                                <h2 className='font-bold text-lg text-gray-500'>After you have successfully made your payment, please send an email us including your email address, username, and invoice details. </h2>
                                <h2 className='font-bold text-lg text-gray-500'>Upon confirming your payment, you will gain access to the complete functionalities of this section.</h2>
                            </div>
                        </div>

                )
            }
        </div>

    );
};

export default Assistant;
