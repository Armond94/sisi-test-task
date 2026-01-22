import type { Student } from "./students";

type FileUploadInput = {
	studentID: Student["id"];
	fileName: string;
	fileContentType: string;
}

export async function submit(inputs: FileUploadInput[]) {
	for (let i = 0; i < inputs.length; i++) {
		const input = inputs[i];

		if (!(input.studentID && input.fileName && input.fileContentType)) {
			console.error("Validation failed for input", i, input);
			return false;
		}
	}

	await new Promise(resolve => setTimeout(resolve, 1000));

	return true;
}