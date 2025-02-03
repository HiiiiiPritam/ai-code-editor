export const getFileLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'py': 'python',
      'cpp': 'cpp',
      'ts': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json'
    };
    return languageMap[extension || ''] || 'plaintext';
  };