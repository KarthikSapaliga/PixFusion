# Function to check if a command is available
function Check-Command {
    param (
        [string]$CommandName
    )
    $result = Get-Command $CommandName -ErrorAction SilentlyContinue
    return $result -ne $null
}

# Check if Python is installed
if (-not (Check-Command "python")) {
    Write-Error "Python is not installed or not added to PATH. Please install Python and try again."
    exit 1
}

# Check if Node.js is installed
if (-not (Check-Command "node")) {
    Write-Error "Node.js is not installed or not added to PATH. Please install Node.js and try again."
    exit 1
}

# Check if npm is installed
if (-not (Check-Command "npm")) {
    Write-Error "npm (Node Package Manager) is not installed or not added to PATH. Please install npm and try again."
    exit 1
}

# Check if exiftool is installed
if (-not (Check-Command "exiftool")) {
    Write-Error "ExifTool is not installed or not added to PATH. Please install ExifTool and try again."
    exit 1
}

# Clone the repository
git clone https://github.com/KarthikSapaliga/PixFushion.git

# Navigate to the project directory
cd PixFushion

# Install Node.js dependencies
npm install

# Create and activate a Python virtual environment
python -m venv env
.\env\Scripts\Activate.ps1

# Navigate to the 'pkg' directory and install Python dependencies
cd pkg
pip install -r requirements.txt

# Return to the main project directory
cd ..

# Run the Python server and npm dev server simultaneously
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c python server.py"
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npm run dev"