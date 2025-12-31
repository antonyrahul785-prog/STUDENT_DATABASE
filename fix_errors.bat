@echo off
cd /d "C:\Users\antony rahul\Desktop\student_database\frontend"

echo Creating missing directories...
mkdir src\styles\components 2>nul
mkdir src\hooks 2>nul
mkdir src\utils 2>nul
mkdir src\components\common\Charts 2>nul
mkdir src\components\common\Table 2>nul
mkdir src\components\payments 2>nul
mkdir src\components\students 2>nul

echo Creating missing files...
echo. > src\components\common\Modal\Modal.css
echo. > src\pages\PaymentsPage.css
echo. > src\pages\StudentsPage.css
echo. > src\pages\auth\LoginPage.css
echo. > src\styles\components\footer.css
echo. > src\styles\components\navbar.css
echo. > src\styles\layout.css

echo Creating placeholder components...
echo // Placeholder > src\components\common\Charts\index.jsx
echo // Placeholder > src\components\common\Table\DataTable.jsx
echo // Placeholder > src\components\common\Table\TableFilters.jsx
echo // Placeholder > src\components\common\Table\Pagination.jsx
echo // Placeholder > src\components\payments\PaymentCard.jsx
echo // Placeholder > src\components\payments\ReceiptGenerator.jsx
echo // Placeholder > src\components\payments\FeeSummary.jsx
echo // Placeholder > src\components\students\StudentCard.jsx
echo // Placeholder > src\components\common\Modal\PaymentModal.jsx
echo // Placeholder > src\components\common\Modal\ConfirmModal.jsx
echo // Placeholder > src\components\common\Modal\ViewStudentModal.jsx

echo Creating hooks and utils...
echo export default () => ({ user: null, token: null }) > src\hooks\useAuth.js
echo export * from '@heroicons/react/24/outline' > src\utils\icons.js
echo export default {} > src\services\analyticsService.js

echo Done! Now run: npm install react-query @tanstack/react-query
pause