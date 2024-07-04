export class ErrorBuilderHelper {
  static buildError(errorDetails: {
    errorMessage: string;
    httpStatus: number;
    details?: string;
  }) {
    console.log('Algum erro ocorreu', errorDetails.errorMessage);
    return errorDetails;
  }
}
