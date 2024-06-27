import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FileUploader.module.scss";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { CloudUploadOutlined, Delete, Download } from "@mui/icons-material";

const FileUploader = ({
	label,
	initialFile,
	onFilesSelected,
	deleteFileHandler,
	name,
	fileKey,
	height = "200px",
	img = {
		height: "108px",
		width: "100px",
	},
}) => {
	const [uploadedFiles, setUploadedFiles] = useState([]);

	useEffect(() => {
		// Set the initial file(s) when the component mounts
		if (initialFile) {
			setUploadedFiles(initialFile?.location?.length ? [initialFile] : initialFile);
		}
	}, [initialFile]);

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		onDrop: (acceptedFiles) => {
			setUploadedFiles(acceptedFiles);
			onFilesSelected(acceptedFiles, name);
		},
	});

	return (
		<div style={{ height: height }} className={styles.dropzone}>
			<div className={styles.mainDropzone} {...(uploadedFiles.length ? {} : getRootProps())}>
				<input {...getInputProps()} />
				<h4 style={{ opacity: 0.8 }} className={styles.label}>
					{label}
				</h4>
			</div>

			{uploadedFiles.length ? (
				<ul className={styles.previewList}>
					{uploadedFiles.map((file) => {
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
							<List key={file.originalname}>
								<ListItem>
									{isImage ? (
										<img
											src={fileSource}
											style={{ height: img.height, width: img.width }}
											className={styles.previewImg}
											alt={file.location ? file.originalname : file.name}
										/>
									) : (
										<>
											<ListItemAvatar>
												<FolderIcon />
											</ListItemAvatar>
											<ListItemText
												className={styles.fileName}
												primary={file.location ? file.originalname : file.name}
											/>
										</>
									)}
								</ListItem>
								<ListItem style={{ alignItems: "center", justifyContent: "center" }}>
									<div className={styles.iconArea}>
										<Download
											onClick={() => {
												const newTab = window.open(fileSource, "_blank");
												if (!newTab) {
													alert("Popup blocked. Please allow popups for image preview.");
												}
											}}
											fontSize="medium"
										/>
										<Delete
											onClick={() => {
												setUploadedFiles([]);
												deleteFileHandler(name, file);
											}}
											fontSize="medium"
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
					<p className={styles.text}>Drag and drop {label} file here or click to browse</p>
				</div>
			)}
		</div>
	);
};

export default FileUploader;
