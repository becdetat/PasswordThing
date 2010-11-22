<?php
print_r($_POST);
print_r($_FILES);
?>

<form method="post"  enctype="multipart/form-data">
<input type="hidden" name="tt" value="hidden" />
	<input type="file" name="test" />
	<button type="submit">Submit</button>
</form>