import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FileDTO, UpdateComment } from "../../types";
import { GetFilesByUpdateCommentAsync } from "../slices/projectSlice";
import { useAppDispatch } from "../slices/store";

interface UpdatePreviewProps {
  updateComment: UpdateComment;
}

const UpdatePreview: React.FC<UpdatePreviewProps> = ({ updateComment }) => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileDTO[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actionResult = await dispatch(
          GetFilesByUpdateCommentAsync(updateComment.id)
        );
        const updateFiles = actionResult.payload;
        if (Array.isArray(updateFiles)) {
          setFiles(updateFiles);
        } else {
          console.error("Invalid project files data received:", updateFiles);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchData();
    return () => {};
  }, []);

  const getFileTypeFromFileName = (fileName: string): string => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    switch (fileExtension) {
      case "png":
      case "jpg":
      case "jpeg":
        return "image";
      case "pdf":
        return "pdf";
      default:
        return "other";
    }
  };

  return (
    <Container>
      {files && files.length > 0 ? (
        <ul>
          {files &&
            files.map((file, index) => (
              <li key={index}>
                <h3>{file.fileName}</h3>
                {getFileTypeFromFileName(file.fileName) === "image" ? (
                  <img
                    src={`data:image/${file.fileName
                      .split(".")
                      .pop()
                      ?.toLowerCase()};base64,${file.content}`}
                    alt={file.fileName}
                  />
                ) : (
                  <p>Filtyp: {file.fileName.split(".").pop()?.toLowerCase()}</p>
                )}
                <a
                  href={`data:image/${file.fileName
                    .split(".")
                    .pop()
                    ?.toLowerCase()};base64,${file.content}`}
                  download={file.fileName}
                  style={{ textDecoration: "none" }}
                >
                  <Typography>Ladda ner</Typography>
                </a>
              </li>
            ))}
        </ul>
      ) : (
        <Typography>Inga filer hittades</Typography>
      )}
    </Container>
  );
};

export default UpdatePreview;
