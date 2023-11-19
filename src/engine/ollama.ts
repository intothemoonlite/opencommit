import axios, { AxiosError } from 'axios';
import { ChatCompletionRequestMessage } from 'openai';
import { AiEngine } from './Engine';

export class OllamaAi implements AiEngine {
  async generateCommitMessage(
    messages: Array<ChatCompletionRequestMessage>
  ): Promise<string | undefined> {

    const model = 'mistral:7b'; // todo: pull from env

    let prompt = messages.map((x) => x.content).join('\n');
	//hoftix: local models are not so clever...
	prompt+='Summarize above git diff in 10 words or less'

	//console.log('prompt length ', prompt.length)
	//console.log('prompt ', prompt)

    const url = 'http://192.168.1.101:11434/api/generate'; // todo: pull this from env
    const p = {
      model,
      prompt,
      stream: false
    };
    //console.log('prompting ollama...', url, model);
    try {
      const response = await axios.post(url, p,{
		
        headers: {
          'Content-Type': 'application/json'
        }
	});
      const answer = response.data?.response
	  console.log('answer', answer)
      return answer;
    } catch (err:any ) {
		const message = err.response?.data?.error ?? err.message
      throw new Error('local model issues. details: '+message);
    }
  }
}

export const ollamaAi = new OllamaAi();
