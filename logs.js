const logTransaction = async (transaction) => {
    const logs = JSON.parse(fs.readFileSync('data/logs.json', 'utf-8'));
    logs.push(transaction);
    fs.writeFileSync('data/logs.json', JSON.stringify(logs, null, 2));
  };
  