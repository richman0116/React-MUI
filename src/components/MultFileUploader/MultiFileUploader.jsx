import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FileUploader.module.scss";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { CloudUploadOutlined, Delete, Download } from "@mui/icons-material";
import { toast } from "react-toastify";

const MultiFileUploader = ({
	label,
	initialFiles,
	onFilesSelected,
	deleteFileHandler,
	name,
	height = "200px",
	img = {
		height: "108px",
		width: "100px",
	},
}) => {
	const [uploadedFiles, setUploadedFiles] = useState([]);

	useEffect(() => {
		// Set the initial files when the component mounts
		if (initialFiles && initialFiles.length > 0) {
			setUploadedFiles(initialFiles);
		}
	}, [initialFiles]);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles, rejectedFiles) => {
			let tooManyFilesErrorEncountered = false;

			rejectedFiles.forEach((file) => {
				const fileError = file.errors && file.errors.length > 0 ? file.errors[0] : null;
				if (fileError) {
					switch (fileError.code) {
						case "too-many-files":
							if (!tooManyFilesErrorEncountered) {
								toast.error("You can only upload a maximum of 4 files.");
								tooManyFilesErrorEncountered = true;
							}
							break;
						case "file-too-large":
							toast.error("The file size should not exceed 1 MB.");
							break;
						default:
							toast.error("Error uploading file. Please try again.");
							break;
					}
				}
			});

			const newFiles = [...uploadedFiles, ...acceptedFiles];
			setUploadedFiles(newFiles);
			onFilesSelected(newFiles, name);
		},

		maxFiles: 4,
		maxSize: 1048576,
	});

	return (
		<div style={{ height: height }} className={styles.dropzone}>
			<div {...getRootProps()} className={styles.mainDropzone}>
				<input {...getInputProps()} />
				<h4 style={{ opacity: 0.8 }} className={styles.label}>
					{label}
				</h4>
			</div>

			{uploadedFiles.length > 0 ? (
				<ul className={styles.previewList}>
					{uploadedFiles.map((file, index) => {
						const isImage =
							(file.contentType && file.contentType.startsWith("image/")) ||
							/\.(jpg|jpeg|png|gif|bmp)$/i.test(file.originalname) ||
							(file.type && file.type.startsWith("image/")) ||
							/\.(jpg|jpeg|png|gif|bmp)$/i.test(file.name);

						const fileSource =
							isImage && file.location
								? file.location
								: isImage
									? URL.createObjectURL(file)
									: file.location;

						return (
							<List key={index}>
								<ListItem>
									{isImage ? (
										<img
											src={fileSource}
											className={styles.previewImg}
											style={{ height: img.height, width: img.width }}
											alt={file.location ? file.originalname : file.name}
										/>
									) : (
										<>
											<ListItemAvatar>
												<FolderIcon />
											</ListItemAvatar>
											<ListItemText
												style={{ fontSize: "10px", width: "100px" }}
												primary={file.location ? file.originalname : file.name}
											/>
										</>
									)}
								</ListItem>
								<ListItem>
									<div className={styles.iconArea}>
										<Download
											onClick={() => {
												const newTab = window.open(fileSource, "_blank");
												if (!newTab) {
													alert("Popup blocked. Please allow popups for file preview.");
												}
											}}
										/>
										<Delete
											onClick={() => {
												const newFiles = [...uploadedFiles];
												newFiles.splice(index, 1);
												setUploadedFiles(newFiles);
												deleteFileHandler(name, file);
											}}
											color="error"
										/>
									</div>
								</ListItem>
							</List>
						);
					})}
				</ul>
			) : (
				<div>
					<p style={{ textAlign: "center", marginBottom: 0 }}>
						<CloudUploadOutlined className={styles.uploadIcon} />
					</p>
					<p className={styles.text}>Drag and drop {label} files here or click to browse</p>
				</div>
			)}
		</div>
	);
};

export default MultiFileUploader;
