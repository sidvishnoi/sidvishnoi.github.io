hash=$(
  cat resume/index.html resume/resume.css |
  git hash-object --stdin |
  xargs -i git rev-parse --short {}
)
sed -i "s/const __version.*/const __version = \"${hash}\";/" resume/resume-service-worker.js
