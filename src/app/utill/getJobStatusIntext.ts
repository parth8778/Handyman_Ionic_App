export const getJobStatusInText = (jobStatus) => {
    let jobStatusInText = '';
    switch (jobStatus) {
      case 0:
        jobStatusInText = 'pending';
        break;

      case 1:
      case 2:
        jobStatusInText = 'inprogress';
        break;

      case 3:
        jobStatusInText = 'completed';
        break;

      case 4:
        jobStatusInText = 'rejected';
        break;

      default:
        jobStatusInText = 'pending';
        break;
    }

    return jobStatusInText;
};