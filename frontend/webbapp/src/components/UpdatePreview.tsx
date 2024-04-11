import DeleteIcon from "@mui/icons-material/Delete";
import { Container, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { isMobile } from "../../globalConstants";
import { FileDTO, UpdateCommentNoDate } from "../../types";
import {
  DeleteFileAsync,
  GetFilesByUpdateCommentAsync,
} from "../slices/projectSlice";
import { useAppDispatch } from "../slices/store";

interface UpdatePreviewProps {
  updateComment: UpdateCommentNoDate;
  isMyUpdateComment: boolean;
}

const UpdatePreview: React.FC<UpdatePreviewProps> = ({
  updateComment,
  isMyUpdateComment,
}) => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileDTO[] | undefined>(undefined);

  const handleDeleteFile = (fileId: string) => {
    console.log("FILEID: ", fileId);
    dispatch(DeleteFileAsync(fileId));
  };

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
  }, [files]);

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
              <li key={index} style={{ listStyle: "none" }}>
                {getFileTypeFromFileName(file.fileName) === "image" ? (
                  <img
                    src={`data:image/${file.fileName
                      .split(".")
                      .pop()
                      ?.toLowerCase()};base64,${file.content}`}
                    alt={file.fileName}
                    style={{
                      maxHeight: isMobile ? 100 : 200,
                      maxWidth: isMobile ? 100 : 200,
                    }}
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
                {isMyUpdateComment ? (
                  <IconButton onClick={() => handleDeleteFile(file.id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
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
