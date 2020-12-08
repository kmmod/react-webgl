function FileUpload(props) {
  const fileLoadHandler = (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const lines = reader.result
        .split(/\r?\n|\r/)
        .filter((item) => item !== "");
      const content = lines.map((item) => item.split(";").map(Number));
      props.onFileChange(content);
    };
  };

  return (
    <div>
      <input type="file" name="file" onChange={fileLoadHandler} />
    </div>
  );
}

export default FileUpload;
