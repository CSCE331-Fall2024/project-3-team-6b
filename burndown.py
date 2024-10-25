import requests
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# GitHub repository details
GITHUB_TOKEN = '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'  # Replace with your token
REPO_OWNER = 'CSCE331-Fall2024'  # e.g., 'octocat'
REPO_NAME = 'project-3-team-6b'  # e.g., 'Hello-World'

# Function to fetch issues from GitHub
def fetch_issues():
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues'
    headers = {'Authorization': f'token {GITHUB_TOKEN}'}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f'Failed to fetch issues: {response.status_code}')
        return []
    
    return response.json()

# Function to process issues and create a burndown chart
def generate_burndown_chart():
    issues = fetch_issues()
    
    # Filter open issues and get creation dates
    open_issues = [issue for issue in issues if 'pull_request' not in issue and issue['state'] == 'open']
    creation_dates = [datetime.strptime(issue['created_at'], '%Y-%m-%dT%H:%M:%SZ') for issue in open_issues]
    
    # Create a date range for the burndown
    start_date = min(creation_dates) if creation_dates else datetime.now()
    end_date = datetime.now()
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')

    # Count open issues per day
    open_issues_count = []
    for date in date_range:
        count = len([issue for issue in open_issues if issue['created_at'] <= date.isoformat() + 'Z'])
        open_issues_count.append(count)

    # Create a DataFrame for plotting
    burndown_data = pd.DataFrame({'Date': date_range, 'Open Issues': open_issues_count})
    
    # Plotting the burndown chart
    plt.figure(figsize=(10, 6))
    plt.plot(burndown_data['Date'], burndown_data['Open Issues'], marker='o')
    plt.title('Burndown Chart')
    plt.xlabel('Date')
    plt.ylabel('Number of Open Issues')
    plt.xticks(rotation=45)
    plt.grid()
    plt.tight_layout()
    plt.show()

# Run the function to generate the chart
generate_burndown_chart()
