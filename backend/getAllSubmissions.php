<?php

require_once 'config.php';
$response = ['success' => false, 'message' => ''];

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // SQL Query to fetch public submissions
    $sql = "SELECT 
                s.SubmissionID, 
                s.Date, 
                s.Status, 
                t.Tname AS TopicName, 
                CASE
                    WHEN s.StudentID IS NOT NULL THEN CONCAT(st.Year, ' - ', st.Department)
                    
                    WHEN s.StaffID IS NOT NULL THEN 'Staff'
                    
                    ELSE 'Staff'
                    
                END AS SubmitterInfo
            FROM submission s
            JOIN topic t ON s.TopicID = t.TopicID
            
            -- LEFT JOIN is crucial, as s.StudentID can be NULL
            LEFT JOIN student st ON s.StudentID = st.StudentID
            WHERE s.TopicID NOT IN (1, 2)
            ORDER BY s.SubmissionID DESC";

    $result = $conn->query($sql);

    $submissions = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $submissions[] = $row;
        }
    }
    
    $response['success'] = true;
    $response['submissions'] = $submissions;

} catch (Exception $e) {
    $response['message'] = "Database error: " . $e->getMessage();
} finally {
    if (isset($conn)) {
        $conn->close();
    }
    echo json_encode($response);
}
?>